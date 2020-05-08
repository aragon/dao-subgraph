// Import event types from the contract ABI
import { DeployDAO as DeployDAOEvent } from '../types/DaoFactory/DAOFactory'

// Import entity types from the schema
import {
  OrgFactory as FactoryEntity,
  Organization as OrganizationEntity,
} from '../types/schema'

// Import templates types
import { Organization as OrganizationTemplate } from '../types/templates'
import { Kernel as KernelContract } from '../types/templates/Organization/Kernel'

export function handleDeployDAO(event: DeployDAOEvent): void {
  let factory = FactoryEntity.load('1')
  const factoryAddress = event.address

  const orgId = event.params.dao.toHexString()
  const orgAddress = event.params.dao

  // if no factory yet, set up empty
  if (factory == null) {
    factory = new FactoryEntity('1')
    factory.address = factoryAddress
    factory.orgCount = 0
    factory.organizations = []
  }
  factory.orgCount = factory.orgCount + 1

  let kernel = KernelContract.bind(orgAddress)

  // create new dao
  const org = new OrganizationEntity(orgId) as OrganizationEntity
  org.address = orgAddress
  org.recoveryVault = kernel.getRecoveryVault()
  org.acl = kernel.acl()
  // TODO: Add system apps?

  // add the org to the factory
  const currentOrganizations = factory.organizations
  currentOrganizations.push(org.id)
  factory.organizations = currentOrganizations

  // save to the store
  factory.save()
  org.save()

  OrganizationTemplate.create(orgAddress)
}
