import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Role } from "./role.entity";
import { Permission } from "./permission.entity";

@Entity("role_permissions")
export class RolePermission {
  @PrimaryColumn({ name: "role_id" })
  roleId: number;

  @PrimaryColumn({ name: "permission_id" })
  permissionId: number;

  @ManyToOne(() => Role, role => role.rolePermissions)
  @JoinColumn({ name: "role_id" })
  role: Role;

  @ManyToOne(() => Permission, permission => permission)
  @JoinColumn({ name: "permission_id" })
  permission: Permission;
}
