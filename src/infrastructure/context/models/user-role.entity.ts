import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Role } from "./role.entity";
import { User } from "./user.entity";

@Entity("user_roles")
export class UserRole {
  @PrimaryColumn({ name: "user_id" })
  userId: number;

  @PrimaryColumn({ name: "role_id" })
  roleId: number;

  @ManyToOne(() => Role, role => role.userRoles)
  @JoinColumn({ name: "role_id" })
  role: Role;

  @ManyToOne(() => User, user => user.userRoles)
  @JoinColumn({ name: "user_id" })
  user: User;
}
