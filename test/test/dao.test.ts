import "mocha";
import path from "path";
import { shell } from "../src/util/exec";
import { deployDao } from "../src/deployDao";
import { waitForUrl, waitForMs, waitForTestnet } from "../src/util/waitFor";
import { renderTemplate } from "../src/util/templates";
import { request } from "graphql-request";
import retry from "async-retry";

const subgraphDir = path.resolve("../");
const subgraphPath = path.join(subgraphDir, "subgraph.yaml");
const subgraphTemplatePath = path.join(subgraphDir, "subgraph.template.yaml");
const graphNode = process.env.GRAPH_NODE || "http://localhost:8020";
const graphServer = process.env.GRAPHQL_SERVER || "http://localhost:8000";
const ipfsNode = process.env.IPFS_NODE || "http://localhost:5001";
const testnetUrl = process.env.TESTNET_URL || "http://localhost:8545";

interface SubgraphConfig {
  network: string; // "mainnet",
  ens: string; // "0x5f6F7E8cc7346a11ca2dEf8f827b7a0b612c56a1",
  daoFactory: string; // "0x5d94e3e7aec542ab0f9129b9a7badeb5b3ca0f77",
  factoryStartBlock: number; // 0,
  apmRegistry: string; // "0x32296d9f8fed89658668875dc73cacf87e8888b2",
  registryStartBlock: number; // 0
}

describe("Deploy a DAO factory and query a DAO", () => {
  let daoAddress: string;
  let daoFactoryAddress: string;
  // Give the subgraph a unique name
  const graphName = "dao-subgraph" + String(Math.random()).slice(2);

  before("Wait for testnet to be live", async () => {
    await waitForTestnet(testnetUrl);
  });

  before("Should deploy a DAOFactory and DAO", async () => {
    const result = await deployDao(testnetUrl);
    daoAddress = result.dao;
    daoFactoryAddress = result.daoFactory;
    console.log("Deployed daoFactory and dao", {
      daoAddress,
      daoFactoryAddress,
    });
  });

  before("Wait for graphNode to be live", async () => {
    // Wait for graphNode
    await waitForUrl(graphNode);
    await waitForMs(1000); // One extra second to ensure success
  });

  before("Should deploy the subgraph", async () => {
    // Write values to config
    const config: SubgraphConfig = {
      network: "mainnet",
      ens: "0x5f6F7E8cc7346a11ca2dEf8f827b7a0b612c56a1",
      daoFactory: daoFactoryAddress,
      factoryStartBlock: 0,
      apmRegistry: "0x32296d9f8fed89658668875dc73cacf87e8888b2",
      registryStartBlock: 0,
    };

    renderTemplate(subgraphTemplatePath, subgraphPath, config);

    await shell(
      `node_modules/.bin/graph create ${graphName} --node ${graphNode}`,
      { cwd: subgraphDir, pipeOutput: true }
    );

    await shell(
      `node_modules/.bin/graph deploy ${graphName} --debug --ipfs ${ipfsNode} --node ${graphNode}`,
      { cwd: subgraphDir, pipeOutput: true }
    );
  });

  it("Should query the deployed DAO", async () => {
    // Wait a bit for graph to process the subgraph
    await waitForMs(2000);

    const query = `{
  organizations(first: 5) {
    address
  }
}
`;

    const data = await retry(
      () => request(`${graphServer}/subgraphs/name/${graphName}`, query),
      { retries: 1 }
    );
    console.log({ data });
  });
});
