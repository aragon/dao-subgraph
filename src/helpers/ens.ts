
import { Address, Bytes } from '@graphprotocol/graph-ts'

import { ENS } from '../types/templates/Kernel/ENS'
import { PublicResolver } from '../types/templates/Kernel/PublicResolver'

// TODO: Handle with mustache
const ENS_ADDRESS = '0x5f6F7E8cc7346a11ca2dEf8f827b7a0b612c56a1'

export function resolveRepoAddress(
  appId: Bytes
): Address {
  const ens = ENS.bind(Address.fromString(ENS_ADDRESS))

  const resolver = PublicResolver.bind(ens.resolver(appId))
  
  return resolver.addr(appId)
}
