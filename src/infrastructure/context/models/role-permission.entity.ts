import { Entity, PrimaryColumn } from "typeorm";

@Entity("role_permissions")
export class RolePermission {
  @PrimaryColumn({ name: "role_id" })
  roleId: number;

  @PrimaryColumn({ name: "permission_id" })
  permissionId: number;
}
