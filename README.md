# Aragon Subgraph

This is a subgraph for the [Aragon Project](https://github.com/aragon).

## Brief Description of The Graph Node Setup

A Graph Node can run multiple subgraphs, and in this case it can have a subgraph for Mainnet and testnets. The subgraph ingests event data by calling to Infura through http. It can also connect to any geth node or parity node that accepts RPC calls (such as a local one). Fast synced geth nodes do work. To use parity, the `--no-warp` flag must be used. Setting up a local Ethereum node is more reliable and faster, but Infura is the easiest way to get started.

These subgraphs has three types of files which tell the Graph Node to ingest events from specific contracts. They are:

- The subgraph manifest (subgraph.yaml)
- A GraphQL schema (schema.graphql)
- Mapping scripts (**Individual** - ACL.ts, constants.ts, EVMScriptRegistry.ts, Finance.ts, Kernel.ts, TokenManager.ts, Vault.ts, Voting.ts | **Network** - DAOFactory.ts, ENSResolverFIFS.ts)

This repository has these files created and ready to compile, so a user can start this subgraph on their own. The only thing that needs to be edited is the contract addresses in the `subgraph.yaml` file to change between Rinkeby or Mainnet. If you are indexing a different Individual-DAO-Subgraph, you will have to grab the contract addresses that are relevant to that subgraph.

We have provided a quick guide on how to start up the Aragon-Subgraph graph node in the next section. If these steps aren't descriptive enough, the [getting started guide](https://github.com/graphprotocol/graph-node/blob/master/docs/getting-started.md) has in depth details on running a subgraph.

### Local

To test the subgraph locally please do the following tasks

##### 1. Install Ganache and The Graph and local dependencies

First make sure you have both Ganache and Graph CLIs, and install project dependencies:

```bash
  npm install -g ganache-cli
  npm install -g @graphprotocol/graph-cli
  npm i
```

##### 2. Start Ganache node

Start a local ganache in a separate terminal with the following params:

```bash
  ganache-cli -h 0.0.0.0 -i 15 --gasLimit 8000000 --deterministic
```

##### 3. Start Graph node

In another terminal, clone the graph node and start it:

```bash
  git clone https://github.com/graphprotocol/graph-node/
  cd graph-node/docker
  rm -rf data
  ./setup.sh
  docker-compose up
```

(See [this issue](https://github.com/graphprotocol/graph-node/issues/1132) about the `setup.sh` script)

> If docker prompts you with the error `The reorg threshold 50 is larger than the size of the chain 7, you probably want to set the ETHEREUM_REORG_THRESHOLD environment variable to 0`,
> simply add a new env variable in `docker-compose.yml` named `ETHEREUM_REORG_THRESHOLD` assigning it to 0 and start it again.

## Viewing the Subgraph on the Graph Hosted Service

This subgraph is not yet on [The Graph Explorer](https://thegraph.com/explorer/). To understand how deploying to the hosted service works, check out the [Deploying Instructions](https://thegraph.com/docs/deploy-a-subgraph) in the official documentation. The most important part of deploying to the hosted service is ensuring that the npm script for `deploy` is updated to the correct name that you want to deploy with.

## Getting started with Querying

Below shows all the ways to query a Individual Subgraph and the network subgraph

### Querying all possible data that is being stored

The query below shows all the information that is possible to query, but is limited to the first 5 instances. Limiting to 5 or 10 instances is good, because with no limit tens of thousands of results can be queried at once, which can be slow on your computer. There are many other filtering options that can be used, just check out the [querying api](https://github.com/graphprotocol/graph-node/blob/master/docs/graphql-api.md). Also check out the [GraphQL docs](https://graphql.org/learn/) if you are completely new to GraphQL and the info in this section doesn't make sense.

The query is set up so that all the internal entities are queried from within the top level entities. The top level entities are the `apps`, which are Kernel, ACL, EVMScriptRegistry, Vault, TokenManager, Finances and Voting.

#### Individual Subgraph Queries

```graphql
{
  kernels {
    id
    appID
    permissions {
      entities
      role
    }
    managers {
      managesManageApps
    }
  }
  acls {
    id
    baseAddress
    appID
    upgradeable
    defaultApp
    permissions {
      entities
      role
    }
    managers {
      managesCreatePermissions
    }
  }
  evmscriptRegistries {
    id
    baseAddress
    appID
    upgradeable
    defaultApp
    permissions {
      entities
      role
    }
    managers {
      managesAddExecutor
      managesEnableAndDisableExecutors
    }
    executors
  }
  vaults {
    id
    baseAddress
    appID
    upgradeable
    defaultApp
    permissions {
      entities
      role
    }
    managers {
      managesTransfers
    }
    transfers {
      amount
      tokenAddress
      to
    }
    deposits {
      amount
      tokenAddress
      sender
    }
  }
  tokenManagers {
    id
    baseAddress
    appID
    upgradeable
    defaultApp
    permissions {
      entities
      role
    }
    managers {
      managesBurn
      managesMint
      managesIssue
      managesAssign
      managesRevokeVestings
    }
  }
  finances {
    id
    baseAddress
    appID
    upgradeable
    defaultApp
    permissions {
      entities
      role
    }
    periods {
      id
      starts
      ends
    }
    transactions {
      id
      incoming
      amount
      entity
      reference
    }
    managers {
      managesChangeBudget
      managesChangePeriod
      managesCreatePayments
      managesManagePayments
      managesExecutePayments
    }
  }
  votings {
    id
    baseAddress
    appID
    upgradeable
    defaultApp
    permissions {
      entities
      role
    }
    managers {
      managesCreateVotes
      managesModifyQuorum
      managesModifySupport
    }
    supportRequiredPercent
    minQuorumPercent
  }
  votes(first: 5) {
    id
    appAddress
    creator
    metadata
    supporters
    supportersStake
    nonSupporters
    nonSupportersStake
    executed
  }
}
```

The command above can be copy pasted into the Graphiql interface in your browser at `127.0.0.1:8000`.

#### Network Subgraph Queries

This subgraph is a lot simpler, as most of the good data is within DAOs. The Kits could still be tracked here, but they don't directly show information in the Dapp, so they were left out. The following can be queried:

```graphql
{
  daos(first: 10) {
    id
  }
  evmscriptRegistries(first: 10) {
    id
  }
  ensresolvers(orderBy: id, first: 10) {
    id
    owner
    resolver
  }
}
```
