import { store } from '@graphprotocol/graph-ts'

// Import entity types from the schema
import { Organization as OrganizationEntity, Permission as PermissionEntity, Role as RoleEntity } from '../types/schema'

// Import event types from the templates contract ABI
import {
  ACL as AclContract,
  SetPermission as SetPermissionEvent,
  SetPermissionParams as SetPermissionParamsEvent,
  ChangePermissionManager as ChangePermissionManagerEvent,
} from '../types/templates/Acl/ACL'

export function handleSetPermission(event: SetPermissionEvent): void {
  const acl = AclContract.bind(event.address)
  const orgAddress = acl.kernel()
  const orgId = orgAddress.toHex()
  const org = OrganizationEntity.load(orgId)

  if (org !== null) {
    const allowed = event.params.allowed

    /****** Update Permission ******/
    const permissionId = event.params.app
      .toHexString()
      .concat('-')
      .concat(event.params.role.toHexString())
      .concat('-')
      .concat(event.params.entity.toHexString())

    if (allowed) {
      // if no Permission yet create new one
      let permission = PermissionEntity.load(permissionId)
      if (permission == null) {
        const appId = event.params.app.toHex()

        // Generate role id
        const roleId = event.params.app
          .toHexString()
          .concat('-')
          .concat(event.params.role.toHexString())

        permission = new PermissionEntity(permissionId) as PermissionEntity
        permission.app = appId
        permission.role = roleId
        permission.entity = event.params.entity
      }

      const orgPermissions = org.permissions || []
      orgPermissions.push(permission.id)
      org.permissions = orgPermissions

      permission.save()
      org.save()
    } else {
      store.remove('Permission', permissionId)
    }
  }
}

export function handleChangePermissionManager(
  event: ChangePermissionManagerEvent
): void {
  const roleHash = event.params.role
  const appId = event.params.app.toHex()

  /****** Update Role ******/
  const roleId = event.params.app
    .toHexString()
    .concat('-')
    .concat(event.params.role.toHexString())

  // If no Role yet create new one
  let role = RoleEntity.load(roleId)
  if (role == null) {
    role = new RoleEntity(roleId) as RoleEntity
    role.hash = roleHash
    role.app = appId
  }

  // Update values
  role.manager = event.params.manager

  role.save()
}

export function handleSetPermissionParams(event: SetPermissionParamsEvent): void {
  const acl = AclContract.bind(event.address)
  const orgAddress = acl.kernel()
  const orgId = orgAddress.toHex()
  const org = OrganizationEntity.load(orgId)

  if (org !== null) {
    /****** Update Permission ******/
    const permissionId = event.params.app
      .toHexString()
      .concat('-')
      .concat(event.params.role.toHexString())
      .concat('-')
      .concat(event.params.entity.toHexString())

      // if no Permission yet create new one
      const permission = PermissionEntity.load(permissionId)
      permission.paramsHash = event.params.paramsHash

      permission.save()
      org.save()
  }
}
