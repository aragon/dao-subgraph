import { Address, Bytes } from '@graphprotocol/graph-ts'

import { resolveRepoAddress } from '../helpers/ens'
import { getAppMetadata } from '../helpers/ipfs'

// Import entity types from the schema
import { Organization as OrganizationEntity, Acl as AclEntity, App as AppEntity } from '../types/schema'

// Import templates types
import {
  Acl as AclTemplate
} from '../types/templates'
import { AppProxyForwarder as AppProxyForwarderContract } from '../types/templates/Organization/AppProxyForwarder'
import { AppProxyPinned as AppProxyPinnedContract } from '../types/templates/Organization/AppProxyPinned'
import { AppProxyUpgradeable as AppProxyUpgradeableContract } from '../types/templates/Organization/AppProxyUpgradeable'
import { Kernel as KernelContract, NewAppProxy as NewAppProxyEvent, SetApp as SetAppEvent } from '../types/templates/Organization/Kernel'

import {
  KERNEL_DEFAULT_ACL_APP_ID,
  KERNEL_APP_BASES_NAMESPACE,
  KERNEL_APP_ADDR_NAMESPACE,
} from '../helpers/constants'

export function handleNewProxyApp(event: NewAppProxyEvent): void {
  const orgId = event.address.toHex()
  const org = OrganizationEntity.load(orgId)

  if (org !== null) {
    const proxy = event.params.proxy.toHex()
    const appId = event.params.appId.toHex()
    const isUpgradeable = event.params.isUpgradeable

    // Create ACL
    if (appId == KERNEL_DEFAULT_ACL_APP_ID) {
      const acl = new AclEntity(proxy) as AclEntity
      acl.address = event.params.proxy
      acl.save()
      org.acl = proxy
      AclTemplate.create(event.params.proxy)
    }

    // Check if app is forwarder
    let isForwarder : boolean
    const appForwarder = AppProxyForwarderContract.bind(event.params.proxy)
    let callResult = appForwarder.try_isForwarder()
    if (callResult.reverted) {
      isForwarder = false
    } else {
      isForwarder = callResult.value
    }

    // Handle implementation
    let implementation : Address
    if (isUpgradeable) {
      const appUpgradeable = AppProxyUpgradeableContract.bind(event.params.proxy)
      implementation = appUpgradeable.implementation()
    } else {
      const appPinned = AppProxyPinnedContract.bind(event.params.proxy)
      implementation = appPinned.implementation()
    }

    // Use ens to resolve repo address
    const repo = resolveRepoAddress(event.params.appId).toHex()

    // Fetch files from ipfs
    const artifact = getAppMetadata(repo, 'artifact.json')
    const manifest = getAppMetadata(repo, 'manifest.json')

    // Create app
    let app = AppEntity.load(proxy)
    if (app == null) {
      app = new AppEntity(proxy) as AppEntity
      app.address = event.params.proxy
      app.appId = appId
      app.isForwarder = isForwarder
      app.isUpgradeable = isUpgradeable
      app.repo = repo
      app.artifact = artifact
      app.manifest = manifest
      app.implementation = implementation
    }

    const orgApps = org.apps || []
    orgApps.push(app.id)
    org.apps = orgApps

    app.save()
    org.save()
  }
}

export function handleSetApp(event: SetAppEvent): void {
  // Only care about changes if they're in the APP_BASE namespace
  if (event.params.namespace.toHex() === KERNEL_APP_BASES_NAMESPACE) {
    let kernel = KernelContract.bind(event.address)

    const namespace = Bytes.fromHexString(KERNEL_APP_ADDR_NAMESPACE) as Bytes

    const proxyAddress = kernel.getApp(
      namespace,
      event.params.appId
    )

    const app = AppEntity.load(proxyAddress.toHex())
    app.implementation = event.params.app

    app.save()
  }
}
