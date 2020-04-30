import { Signer } from "ethers";
import { DAOFactoryFactory } from "../typechain/DAOFactory_Factory";
import { KernelFactory } from "../typechain/Kernel_Factory";
import { ACLFactory } from "../typechain/ACL_Factory";
import { EVMScriptRegistryFactoryFactory } from "../typechain/EVMScriptRegistryFactory_Factory";

export function Factory(signer?: Signer) {
  return {
    DAOFactory: new DAOFactoryFactory(signer),
    Kernel: new KernelFactory(signer),
    ACL: new ACLFactory(signer),
    EVMScriptRegistryFactory: new EVMScriptRegistryFactoryFactory(signer),
  };
}
