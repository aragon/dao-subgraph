// Import entity types from the schema
import {
  Kernel,
  ACL,
  AppBase,
  AppProxy
} from '../types/schema'

// Import templates types
import {SetApp, NewAppProxy} from '../types/templates/Kernel/Kernel'
import {
  ACL as ACLContract
} from '../types/templates'

import {
  KERNEL_DEFAULT_ACL_APP_ID,
} from './constants'

export function handleSetApp(event: SetApp): void {
  const kernelID = event.address.toHex()
  const kernel = Kernel.load(kernelID)

  if (kernel !== null) {
    const namespace = event.params.namespace.toHex()
    const appId = event.params.appId.toHex()
    const address = event.params.app.toHex()
  
    // Update app mapping
    let appBase = AppBase.load(address) 
    if (appBase == null) {
      appBase = new AppBase(address)
      appBase.namespace = namespace
      appBase.appID = appId
    }
    appBase.address = event.params.app

    const kernelApps = kernel.appsBases || []
    kernelApps.push(appBase.id)
    kernel.appsBases = kernelApps
    appBase.save()
    kernel.save()
  }
}

export function handleNewProxyApp(event: NewAppProxy): void {
  const kernelID = event.address.toHex()
  const kernel = Kernel.load(kernelID)

  if (kernel !== null) {
    const proxy = event.params.proxy.toHex()
    const appId = event.params.appId.toHex()
    const isUpgradeable = event.params.isUpgradeable

    // Create ACL
    if (appId == KERNEL_DEFAULT_ACL_APP_ID) {
      const acl = new ACL(proxy)
      acl.save()
      kernel.acl = proxy
      ACLContract.create(event.params.proxy)
    }

    // Update app proxies
    let appProxy = AppProxy.load(proxy) 
    if (appProxy == null) {
      appProxy = new AppProxy(proxy)
      appProxy.appID = appId
      appProxy.isUpgradeable = isUpgradeable
      appProxy.address = event.params.proxy
    } 
    const kernelApps = kernel.appsProxies || []
    kernelApps.push(appProxy.id)
    kernel.appsProxies = kernelApps
    appProxy.save()
    kernel.save()
  } 
}
