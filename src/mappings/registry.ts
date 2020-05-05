// Import entity types from the schema
import { Registry as RegistryEntity, Repo as RepoEntity } from '../types/schema'

// Import templates types
import { Repo as RepoTemplate } from '../types/templates'
// Import event types
import { NewRepo as NewRepoEvent, NewAppProxy as NewAppProxyEvent } from '../types/templates/Registry/APMRegistry'

export function handleNewRepo(event: NewRepoEvent): void {
  const registryId = event.address.toHex()
  let registry = RegistryEntity.load(registryId)

  const repoId = event.params.repo.toHex()
  const repoAddress = event.params.repo

  // if no registry yet, set up empty
  if (registry == null) {
    registry = new RegistryEntity(registryId)
    registry.repoCount = 0
    registry.repos = []
  }
  registry.repoCount = registry.repoCount + 1

  // create new repo
  const repo = new RepoEntity(repoId) as RepoEntity
  repo.address = repoAddress
  repo.node = event.params.id
  repo.name = event.params.name

  // add the repo for the derived relationship
  const currentRepos = registry.repos
  currentRepos.push(repo.id)
  registry.repos = currentRepos


  // save to the store
  registry.save()
  repo.save()

  RepoTemplate.create(repoAddress)
}

export function handleNewProxyApp(event: NewAppProxyEvent): void {}
