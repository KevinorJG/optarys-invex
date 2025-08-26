import { Entity, PrimaryColumn } from "typeorm";

@Entity("user_permissions")
export class UserPermission {
  @PrimaryColumn({ name: "user_id" })
  userId: number;

  @PrimaryColumn({ name: "permission_id" })
  permissionId: number;
}
