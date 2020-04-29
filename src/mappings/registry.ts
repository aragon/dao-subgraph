// Import event types from the registrar contract ABI
import { NewRepo as NewRepoEvent, NewAppProxy as NewAppProxyEvent } from '../types/Registry/APMRegistry'

// Import entity types from the schema
import { Registry as RegistryEntity, Repo as RepoEntity } from '../types/schema'

// Import templates types
import { Repo as RepoContract } from '../types/templates'

export function handleNewRepo(event: NewRepoEvent): void {
  let registry = RegistryEntity.load('1')

  // if no factory yet, set up empty
  if (registry == null) {
    registry = new RegistryEntity('1')
    registry.repoCount = 0
    registry.repos = []
  }
  registry.repoCount = registry.repoCount + 1

  // create new repo
  const repo = new RepoEntity(event.params.repo.toHex()) as RepoEntity
  repo.address = event.params.repo
  repo.node = event.params.id
  repo.name = event.params.name

  // add the dao for the derived relationship
  const currentRepos = registry.repos
  currentRepos.push(repo.id)
  registry.repos = currentRepos

  // save to the store
  registry.save()
  repo.save()

  RepoContract.create(event.params.repo)
}

export function handleNewProxyApp(event: NewAppProxyEvent): void {}
