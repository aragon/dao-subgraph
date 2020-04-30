import { ethers } from "ethers";
import { Factory } from "./factory";
import { getLog } from "./util/getLog";

export async function deployDao(url: string) {
  const provider = new ethers.providers.JsonRpcProvider(url);
  const signer0 = provider.getSigner(0);
  const rootAccount = await signer0.getAddress();
  const factory = Factory(signer0);

  // Deploy a DAOFactory.
  const kernelBase = await factory.Kernel.deploy(true); // petrifyImmediately
  const aclBase = await factory.ACL.deploy();
  const registryFactory = await factory.EVMScriptRegistryFactory.deploy();
  const daoFactory = await factory.DAOFactory.deploy(
    kernelBase.address,
    aclBase.address,
    registryFactory.address
  );

  const daoTx = await daoFactory.newDAO(rootAccount);
  const daoAddress = await getLog<string>(daoTx, "DeployDAO", "dao");

  return {
    daoFactory: daoFactory.address,
    dao: daoAddress,
  };
}
