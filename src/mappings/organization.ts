import { Address, Bytes, log } from '@graphprotocol/graph-ts'

import { resolveRepo } from '../helpers/ens'
import { getAppMetadata } from '../helpers/ipfs'

// Import entity types from the schema
import { Organization as OrganizationEntity, Repo as RepoEntity, App as AppEntity } from '../types/schema'

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

    // Create ACL template
    if (appId == KERNEL_DEFAULT_ACL_APP_ID) {
      org.acl = event.params.proxy
      AclTemplate.create(event.params.proxy)
    }

    // Create app
    let app = AppEntity.load(proxy)
    if (app == null) {
      // Check if app is forwarder
      let isForwarder : boolean
      const appForwarder = AppProxyForwarderContract.bind(event.params.proxy)
      let callForwarderResult = appForwarder.try_isForwarder()
      if (callForwarderResult.reverted) {
        isForwarder = false
      } else {
        isForwarder = callForwarderResult.value
      }

      // Handle implementation
      let implementation : Address
      if (isUpgradeable) {
        const appUpgradeable = AppProxyUpgradeableContract.bind(event.params.proxy)
        // let callAppResult = appUpgradeable.try_implementation()
        // if (callAppResult.reverted) {
        //   log.info("appUpgradeable reverted", [])
        // } else {
        //   implementation = callAppResult.value
        // }
        implementation = appUpgradeable.implementation()
      } else {
        const appPinned = AppProxyPinnedContract.bind(event.params.proxy)
        // let callAppResult = appPinned.try_implementation()
        // if (callAppResult.reverted) {
        //   log.info("appPinned reverted", [])
        // } else {
        //   implementation = callAppResult.value
        // }
        implementation = appPinned.implementation()
      }

      app = new AppEntity(proxy) as AppEntity
      app.address = event.params.proxy
      app.appId = appId
      app.isForwarder = isForwarder
      app.isUpgradeable = isUpgradeable
      app.implementation = implementation
      // Use ens to resolve repo
      const repoId = resolveRepo(event.params.appId)
      if (repoId) {
        const repo = RepoEntity.load(repoId)
        app.repoVersion = repo.lastVersion
        app.artifact = getAppMetadata(repoId, 'artifact.json')
      }
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

    let callResult = kernel.try_getApp(
      namespace,
      event.params.appId
    )
    if (callResult.reverted) {
      log.info("kernel reverted", [])
    } else {
      const proxyAddress = callResult.value

      const app = AppEntity.load(proxyAddress.toHex())
      app.implementation = event.params.app
      // Use ens to resolve repo
      const repoId = resolveRepo(event.params.appId)
      if (repoId) {
        const repo = RepoEntity.load(repoId)
        app.repoVersion = repo.lastVersion
        app.artifact = getAppMetadata(repoId, 'artifact.json')
      }

      app.save()
    }
  }
}
