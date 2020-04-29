// Import entity types from the schema
import { Repo, Version } from '../types/schema'

// Import templates types
import { NewVersion, Repo as RepoContract } from '../types/templates/Repo/Repo'

export function handleNewVersion(event: NewVersion): void {
  const repoId = event.address.toHex()
  const repo = Repo.load(repoId)

  if (repo !== null) {
    const repoContract = RepoContract.bind(event.address)
    const versionData = repoContract.getByVersionId(event.params.versionId)

    const versionId = event.params.versionId
      .toHexString()
      .concat('-')
      .concat(event.params.semanticVersion.toString())

    // create new version
    let version = Version.load(versionId)
    if (version == null) {
      version = new Version(versionId) as Version
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
