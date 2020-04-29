// Import event types from the contract ABI
import { DeployDAO as DeployDAOEvent } from '../types/Factory/DAOFactory'

// Import entity types from the schema
import { Factory as FactoryEntity, Organization as OrganizationEntity } from '../types/schema'

// Import templates types
import { Organization as OrganizationTemplate } from '../types/templates'
import { Kernel as KernelContract } from '../types/templates/Organization/Kernel'

export function handleDeployDAO(event: DeployDAOEvent): void {
  let factory = FactoryEntity.load('1')
  let kernel = KernelContract.bind(event.params.dao)

  // if no factory yet, set up empty
  if (factory == null) {
    factory = new FactoryEntity('1')
    factory.organizationCount = 0
    factory.organizations = []
  }
  factory.organizationCount = factory.organizationCount + 1

  // create new dao
  const org = new OrganizationEntity(event.params.dao.toHexString()) as OrganizationEntity
  org.address = event.params.dao
  org.recoveryVault = kernel.getRecoveryVault()

  // add the dao for the derived relationship
  const currentOrganizations = factory.organizations
  currentOrganizations.push(org.id)
  factory.organizations = currentOrganizations

  // save to the store
  factory.save()
  org.save()

  OrganizationTemplate.create(event.params.dao)
}
