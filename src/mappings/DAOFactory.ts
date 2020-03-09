// Import event types from the registrar contract ABI
import {DeployDAO} from '../types/DAOFactory/DAOFactory'

// Import entity types from the schema
import {DAOFactory, Kernel} from '../types/schema'

// Import templates types
import { Kernel as KernelContract } from '../types/templates'


export function handleDeployDAO(event: DeployDAO): void {
  let factory = DAOFactory.load('1')

  // if no factory yet, set up blank initial
  if (factory == null) {
    factory = new DAOFactory('1')
    factory.daoCount = 0
    factory.daos = []
  }
  const currentDaos = factory.daos
  currentDaos.push(event.params.dao.toHex())
  factory.daos = currentDaos
  factory.daoCount = factory.daoCount + 1
  factory.save()

  const kernel = new Kernel(event.params.dao.toHex())
  kernel.save()

  KernelContract.create(event.params.dao)
}
