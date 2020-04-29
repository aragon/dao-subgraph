// Import entity types from the schema
import { Version } from '../types/schema'

// Import templates types
import { Repo as RepoContract } from '../types/templates'
import { NewVersion } from '../types/templates/Repo/Repo'

export function handleNewVersion(event: NewVersion): void {
  const repo = RepoContract.bind(event.address)
  const versionData = repo.getByVersionId(event.params.versionId)

  // create new version
  const versionId = event.params.versionId
    .toHexString()
    .concat('-')
    .concat(event.params.semanticVersion.toString())
  const version = new Version(versionId) as Version
  version.semanticVersion = versionData.semanticVersion.toHexString()
  version.contractAddress = versionData.contractAddress
  version.content = versionData.contentURI.toHexString()
  version.repo = event.address.toHex()

  version.save()
}
