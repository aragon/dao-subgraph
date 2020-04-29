// Import event types from the contract ABI
import { DeployDAO } from '../types/DAOFactory/DAOFactory'

// Import entity types from the schema
import { DAOFactory, Kernel } from '../types/schema'

// Import templates types
import { Kernel as KernelTemplate } from '../types/templates'
import { Kernel as KernelContract } from '../types/templates/Kernel/Kernel'

export function handleDeployDAO(event: DeployDAO): void {
  let factory = DAOFactory.load('1')
  let kernel = KernelContract.bind(event.params.dao)

  // if no factory yet, set up empty
  if (factory == null) {
    factory = new DAOFactory('1')
    factory.daoCount = 0
    factory.daos = []
  }
  factory.daoCount = factory.daoCount + 1

  // create new dao
  const dao = new Kernel(event.params.dao.toHexString()) as Kernel
  dao.recoveryVault = kernel.getRecoveryVault()

  // add the dao for the derived relationship
  const currentDaos = factory.daos
  currentDaos.push(dao.id)
  factory.daos = currentDaos

  // save to the store
  factory.save()
  dao.save()

  KernelTemplate.create(event.params.dao)
}
