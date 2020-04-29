import { ipfs } from '@graphprotocol/graph-ts'

import { Repo, Version } from '../types/schema'

export function getAppMetadata(
  repoId: string, 
  fileName: string,
): string {
  const repo = Repo.load(repoId)
  const lastVersionId = repo.lastVersion
  const lastVersion = Version.load(lastVersionId)

  const contentHash = lastVersion.content

  const filePath = `${contentHash}/${fileName}`
  const file = ipfs.cat(filePath).toHexString()

  return file
}
