// Import entity types from the schema
import { ACL, Permission, Role } from '../types/schema'

// Import event types from the templates contract ABI
import {
  SetPermission,
  SetPermissionParams,
  ChangePermissionManager,
} from '../types/templates/ACL/ACL'

import {} from './constants'

export function handleSetPermission(event: SetPermission): void {
  const aclId = event.address.toHex()
  const acl = ACL.load(aclId)

  if (acl !== null) {
    const app = event.params.app.toHex()
    const entity = event.params.entity
    const allowed = event.params.allowed

    // Generate role id
    const role = event.params.app
      .toHexString()
      .concat('-')
      .concat(event.params.role.toHexString())

    /****** Update Permission ******/
    const permissionId = event.params.app
      .toHexString()
      .concat('-')
      .concat(event.params.role.toHexString())
      .concat('-')
      .concat(event.params.entity.toHexString())

    // if no Permission yet create new one
    let permission = Permission.load(permissionId)
    if (permission == null) {
      permission = new Permission(permissionId) as Permission
      permission.app = app
      permission.role = role
      permission.entity = entity
    }
        
    // update values
    permission.allowed = allowed

    const aclPermissions = acl.permissions || []
    aclPermissions.push(permission.id)
    acl.permissions = aclPermissions

    permission.save()
    acl.save()
  }
}

export function handleChangePermissionManager(
  event: ChangePermissionManager
): void {
  const app = event.params.app.toHex()
  const roleName = event.params.role.toHexString()
  const manager = event.params.manager

  /****** Update Role ******/
  const roleId = event.params.app
    .toHexString()
    .concat('-')
    .concat(event.params.role.toHexString())

  // If no Role yet create new one
  let role = Role.load(roleId)
  if (role == null) {
    role = new Role(roleId) as Role
    role.role = roleName
    role.app = app
  }

  // Update values
  role.manager = manager

  role.save()
}

export function handleSetPermissionParams(event: SetPermissionParams): void {}
