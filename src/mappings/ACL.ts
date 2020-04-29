// Import entity types from the schema
import { Acl as AclEntity, Permission as PermissionEntity, Role as RoleEntity } from '../types/schema'

// Import event types from the templates contract ABI
import {
  SetPermission as SetPermissionEvent,
  SetPermissionParams as SetPermissionParamsEvent,
  ChangePermissionManager as ChangePermissionManagerEvent,
} from '../types/templates/Acl/ACL'

export function handleSetPermission(event: SetPermissionEvent): void {
  const aclId = event.address.toHex()
  const acl = AclEntity.load(aclId)

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
    let permission = PermissionEntity.load(permissionId)
    if (permission == null) {
      permission = new PermissionEntity(permissionId) as PermissionEntity
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
  event: ChangePermissionManagerEvent
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
  let role = RoleEntity.load(roleId)
  if (role == null) {
    role = new RoleEntity(roleId) as RoleEntity
    role.role = roleName
    role.app = app
  }

  // Update values
  role.manager = manager

  role.save()
}

export function handleSetPermissionParams(event: SetPermissionParamsEvent): void {}
