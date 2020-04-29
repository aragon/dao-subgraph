
import { Address, Bytes } from '@graphprotocol/graph-ts'

import { ENS_ADDRESS } from '../mappings/constants'

import { ENS } from '../types/templates/Kernel/ENS'
import { PublicResolver } from '../types/templates/Kernel/PublicResolver'

export function resolveRepoAddress(
  appId: Bytes
): Address {
  const ens = ENS.bind(Address.fromString(ENS_ADDRESS))

  const resolver = PublicResolver.bind(ens.resolver(appId))
  
  return resolver.addr(appId)
}
