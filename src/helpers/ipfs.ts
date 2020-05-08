import { ipfs, log } from '@graphprotocol/graph-ts'

import { Version } from '../types/schema'

export function getAppMetadata(
  repoVersionId: string,
  fileName: string
): string {
  const version = Version.load(repoVersionId)

  const contentLocation = version.contentUri.split(':')[0]

  if (contentLocation === 'ipfs') {
    const contentHash = version.contentUri.split(':')[1]

    const filePath = `${contentHash}/${fileName}`
    const file = ipfs.cat(filePath)

    if (file === null) {
      log.warning('Content {} on {} was not resolved ', [
        filePath,
        repoVersionId,
      ])
      return ''
    }

    return file.toString()
  }
  return ''
}
