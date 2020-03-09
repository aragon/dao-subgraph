// Import entity types from the schema
import {
  ACL
} from '../types/schema'

// Import event types from the templates contract ABI
import {SetPermission, SetPermissionParams, ChangePermissionManager} from '../types/templates/ACL/ACL'

// // Import entity types from the schema
// import {
//   EVMScriptRegistryPermission,
//   ACLPermission,
//   KernelPermission,
//   EVMScriptRegistryManagers,
//   ACLManagers,
//   KernelManagers,
//   EVMScriptRegistry,
//   ACL,
//   Kernel
// } from '../types/schema'

// import {
//   EVM_SCRIPT_REGISTRY_ADD_EXECUTOR_ROLE_HASH,
//   EVM_SCRIPT_REGISTRY_MANAGER_ROLE_HASH, // alias for enable and disable executors
//   roleLookupTable
// } from './constants'

//     mapping (bytes32 => bytes32) internal permissions; // permissions hash => params hash
//     mapping (bytes32 => Param[]) internal permissionParams; // params hash => params

//     // Who is the manager of a permission
//     mapping (bytes32 => address) internal permissionManager;

//     event SetPermission(address indexed entity, address indexed app, bytes32 indexed role, bool allowed);
//     event SetPermissionParams(address indexed entity, address indexed app, bytes32 indexed role, bytes32 paramsHash);
//     event ChangePermissionManager(address indexed app, bytes32 indexed role, address indexed manager);

//     /**
//     * @dev Internal function called to actually save the permission
//     */
//    function _setPermission(address _entity, address _app, bytes32 _role, bytes32 _paramsHash) internal {
//     permissions[permissionHash(_entity, _app, _role)] = _paramsHash;
//     bool entityHasPermission = _paramsHash != NO_PERMISSION;
//     bool permissionHasParams = entityHasPermission && _paramsHash != EMPTY_PARAM_HASH;

//     emit SetPermission(_entity, _app, _role, entityHasPermission);
//     if (permissionHasParams) {
//         emit SetPermissionParams(_entity, _app, _role, _paramsHash);
//     }
// }

export function handleSetPermission(event: SetPermission): void {
  const aclID = event.address.toHex()
  const acl = ACL.load(aclID)

  // // EVMScriptRegistry
  // else if (EVMScriptRegistry.load(id) != null) {
  //   let evmsr = EVMScriptRegistryPermission.load(role)
  //   if (evmsr == null) {
  //     evmsr = new EVMScriptRegistryPermission(role)
  //     evmsr.entities = new Array<string>()
  //     evmsr.appAddress = id
  //   }
  //   if (event.params.allowed == true) {
  //     let roleName = roleLookupTable.get(role) as string
  //     evmsr.role = roleName
  //     let entities = evmsr.entities
  //     let i = entities.indexOf(entity)
  //     if (i == -1) {
  //       entities.push(entity)
  //       evmsr.entities = entities
  //       evmsr.save()
  //     }
  //   } else if (event.params.allowed == false) {
  //     let entities = evmsr.entities
  //     let i = entities.indexOf(entity)
  //     entities.splice(i, 1)
  //     evmsr.entities = entities
  //     evmsr.save()
  //   }
  // }

  // // ACL
  // else if (ACL.load(id) != null) {
  //   let aclp = ACLPermission.load(role)
  //   if (aclp == null) {
  //     aclp = new ACLPermission(role)
  //     aclp.entities = new Array<string>()
  //     aclp.appAddress = id
  //   }
  //   if (event.params.allowed == true) {
  //     let roleName = roleLookupTable.get(role) as string
  //     aclp.role = roleName
  //     let entities = aclp.entities
  //     let i = entities.indexOf(entity)
  //     if (i == -1) {
  //       entities.push(entity)
  //       aclp.entities = entities
  //       aclp.save()
  //     }
  //   } else if (event.params.allowed == false) {
  //     let entities = aclp.entities
  //     let i = entities.indexOf(entity)
  //     entities.splice(i, 1)
  //     aclp.entities = entities
  //     aclp.save()
  //   }
  // }

  // // Kernel
  // else if (Kernel.load(id) != null) {
  //   let kp = KernelPermission.load(role)
  //   if (kp == null) {
  //     kp = new KernelPermission(role)
  //     kp.entities = new Array<string>()
  //     kp.appAddress = id
  //   }
  //   if (event.params.allowed == true) {
  //     let roleName = roleLookupTable.get(role) as string
  //     kp.role = roleName
  //     let entities = kp.entities
  //     let i = entities.indexOf(entity)
  //     if (i == -1) {
  //       entities.push(entity)
  //       kp.entities = entities
  //       kp.save()
  //     }
  //   } else if (event.params.allowed == false) {
  //     let entities = kp.entities
  //     let i = entities.indexOf(entity)
  //     entities.splice(i, 1)
  //     kp.entities = entities
  //     kp.save()
  //   }
  // }
}

export function handleChangePermissionManager(event: ChangePermissionManager): void {
  const aclID = event.address.toHex()
  const acl = ACL.load(aclID)

  // // EVMScriptRegistry
  // else if (EVMScriptRegistry.load(id) != null) {
  //   let evmsr = EVMScriptRegistryManagers.load(id)
  //   if (evmsr == null) {
  //     evmsr = new EVMScriptRegistryManagers(id)
  //   }
  //   if (role == EVM_SCRIPT_REGISTRY_ADD_EXECUTOR_ROLE_HASH) {
  //     evmsr.managesAddExecutor = manager
  //     evmsr.save()
  //   } else if (role == EVM_SCRIPT_REGISTRY_MANAGER_ROLE_HASH) {
  //     evmsr.managesEnableAndDisableExecutors = manager
  //     evmsr.save()
  //   }
  // }

  // // ACL
  // else if (ACL.load(id) != null) {
  //   let am = ACLManagers.load(id)
  //   if (am == null) {
  //     am = new ACLManagers(id)
  //   }
  //   am.managesCreatePermissions = manager
  //   am.save()
  // }

  // //Kernel
  // else if (Kernel.load(id) != null) {
  //   let km = KernelManagers.load(id)
  //   if (km == null) {
  //     km = new KernelManagers(id)
  //   }
  //   km.managesManageApps = manager
  //   km.save()
  // }
}

export function handleSetPermissionParams(event: SetPermissionParams): void {

}
