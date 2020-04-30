// Import entity types from the schema
import { Repo as RepoEntity, Version as VersionEntity } from '../types/schema'

// Import templates types
import { NewVersion as NewVersionEvent, Repo as RepoContract } from '../types/templates/Repo/Repo'

export function handleNewVersion(event: NewVersionEvent): void {
  const repoId = event.address.toHex()
  const repo = RepoEntity.load(repoId)

  if (repo !== null) {
    const repoContract = RepoContract.bind(event.address)
    const versionData = repoContract.getByVersionId(event.params.versionId)

    const versionId = event.params.versionId
      .toHexString()
      .concat('-')
      .concat(event.params.semanticVersion.toString())

    // create new version
    let version = VersionEntity.load(versionId)
    if (version == null) {
      version = new VersionEntity(versionId) as VersionEntity
      version.semanticVersion = event.params.semanticVersion.toString()
      version.contractAddress = versionData.value1
      version.content = versionData.value2.toHexString()
      version.repo = event.address.toHex()
    }

    repo.lastVersion = version.id

    version.save()
    repo.save()
  }
}
