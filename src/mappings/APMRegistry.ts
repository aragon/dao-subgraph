// Import event types from the registrar contract ABI
import { NewRepo, NewAppProxy } from '../types/APMRegistry/APMRegistry'

// Import entity types from the schema
import { APMRegistry, Repo } from '../types/schema'

// Import templates types
import { Repo as RepoContract } from '../types/templates'

export function handleNewRepo(event: NewRepo): void {
  let registry = APMRegistry.load('1')

  // if no registry yet, set up blank initial
  if (registry == null) {
    registry = new APMRegistry('1')
    registry.repoCount = 0
    registry.repos = []
  }
  registry.repoCount = registry.repoCount + 1

  // create new repo
  const repo = new Repo(event.params.id.toHexString()) as Repo
  repo.name = event.params.name
  repo.address = event.params.repo

  // add the dao for the derived relationship
  const currentRepos = registry.repos
  currentRepos.push(repo.id)
  registry.repos = currentRepos

  // save to the store
  registry.save()
  repo.save()

  RepoContract.create(event.params.repo)
}

export function handleNewProxyApp(event: NewAppProxy): void {}
