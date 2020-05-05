// Import event types from the contract ABI
import { DeployAPM as DeployAPMEvent } from '../types/RegistryFactory/APMRegistryFactory'

// Import entity types from the schema
import { RegistryFactory as RegistryFactoryEntity, Registry as RegistryEntity } from '../types/schema'

// Import templates types
import { Registry as RegistryTemplate } from '../types/templates'

export function handleDeployAPM(event: DeployAPMEvent): void {
  let factory = RegistryFactoryEntity.load('1')
  const factoryAddress = event.address

  const registryId = event.params.apm.toHex()
  const registryAddress = event.params.apm

  const node = event.params.node

  // if no factory yet, set up empty
  if (factory == null) {
    factory = new RegistryFactoryEntity('1')
    factory.address = factoryAddress
    factory.registryCount = 0
    factory.registries = []
  }
  factory.registryCount = factory.registryCount + 1

  // create new registry
  const registry = new RegistryEntity(registryId) as RegistryEntity
  registry.address = registryAddress
  registry.node = node
  registry.repoCount = 0
  registry.repos = []

  // add the dao for the derived relationship
  const currentRegistries = factory.registries
  currentRegistries.push(registry.id)
  factory.registries = currentRegistries

  // save to the store
  factory.save()
  registry.save()

  RegistryTemplate.create(registryAddress)
}
