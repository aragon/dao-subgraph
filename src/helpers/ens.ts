
import { Address, Bytes } from '@graphprotocol/graph-ts'

import { ENS } from '../types/templates/Organization/ENS'
import { PublicResolver } from '../types/templates/Organization/PublicResolver'

// TODO: Handle with mustache
const ENS_ADDRESS = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'

export function resolveRepoAddress(
  appId: Bytes
): Address {
  const ens = ENS.bind(Address.fromString(ENS_ADDRESS))

  const resolver = PublicResolver.bind(ens.resolver(appId))
  
  return resolver.addr(appId)
}
