import { ipfs } from '@graphprotocol/graph-ts'

import { Repo, Version } from '../types/schema'

export function getAppMetadata(
  repoId: string
): { artifact: string, manifest: string } {
  const repo = Repo.load(repoId)
  const lastVersionId = repo.versions[-1]
  const lastVersion = Version.load(lastVersionId)

  const contentHash = lastVersion.content

  const artifactPath = `${contentHash}/artifact.json`
  const artifact = ipfs.cat(artifactPath).toHexString()

  const manifestPath = `${contentHash}/artifact.json`
  const manifest = ipfs.cat(manifestPath).toHexString()

  return { artifact, manifest }
}
