import { Address } from '@graphprotocol/graph-ts'

import { resolveRepoAddress } from '../helpers/ens'
import { getAppMetadata } from '../helpers/ipfs'

// Import entity types from the schema
import { Kernel, ACL, App } from '../types/schema'

// Import templates types
import {
  ACL as ACLContract,
  Kernel as KernelContract,
} from '../types/templates'
import { AppProxyForwarder } from '../types/templates/Kernel/AppProxyForwarder'
import { AppProxyPinned } from '../types/templates/Kernel/AppProxyPinned'
import { AppProxyUpgradeable } from '../types/templates/Kernel/AppProxyUpgradeable'
import { SetApp, NewAppProxy } from '../types/templates/Kernel/Kernel'

import {
  KERNEL_DEFAULT_ACL_APP_ID,
  KERNEL_APP_BASES_NAMESPACE,
  KERNEL_APP_ADDR_NAMESPACE,
} from './constants'

export function handleNewProxyApp(event: NewAppProxy): void {
  const kernelId = event.address.toHex()
  const kernel = Kernel.load(kernelId)

  if (kernel !== null) {
    const proxy = event.params.proxy.toHex()
    const appId = event.params.appId.toHex()
    const isUpgradeable = event.params.isUpgradeable

    // Create ACL
    if (appId == KERNEL_DEFAULT_ACL_APP_ID) {
      const acl = new ACL(proxy) as ACL
      acl.save()
      kernel.acl = proxy
      ACLContract.create(event.params.proxy)
    }

    // Check if app is forwarder
    let isForwarder : boolean
    try {
      const appForwarder = AppProxyForwarder.bind(event.params.proxy)
      isForwarder = appForwarder.isForwarder()
    } catch (e) {
      isForwarder = false
    }

    // Handle implementation
    let implementation : Address
    if (isUpgradeable) {
      const appUpgradeable = AppProxyUpgradeable.bind(event.params.proxy)
      implementation = appUpgradeable.implementation()
    } else {
      const appPinned = AppProxyPinned.bind(event.params.proxy)
      implementation = appPinned.implementation()
    }

    // use ens to resolve repo address
    const repo = resolveRepoAddress(event.params.appId).toHex()

    // Fetch files from ipfs
    const repoData = getAppMetadata(repo)
    const artifact = repoData.artifact
    const manifest = repoData.manifest

    // Create app
    let app = App.load(proxy)
    if (app == null) {
      app = new App(proxy) as App
      app.appId = appId
      app.isForwarder = isForwarder
      app.isUpgradeable = isUpgradeable
      app.repo = repo
      app.artifact = artifact
      app.manifest = manifest
      app.implementation = implementation
    }

    const kernelApps = kernel.apps || []
    kernelApps.push(app.id)
    kernel.apps = kernelApps

    app.save()
    kernel.save()
  }
}

export function handleSetApp(event: SetApp): void {
  // Only care about changes if they're in the APP_BASE namespace
  if (event.params.namespace.toHex() === KERNEL_APP_BASES_NAMESPACE) {
    let kernel = KernelContract.bind(event.address)
    const proxyAddress = kernel.getApp(
      KERNEL_APP_ADDR_NAMESPACE,
      event.params.appId
    )

    const app = App.load(proxyAddress.toHex())
    app.implementation = event.params.app

    app.save()
  }
}
