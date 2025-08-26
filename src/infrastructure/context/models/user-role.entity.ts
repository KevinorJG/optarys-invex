import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Role } from "./role.entity";
import { User } from "./user.entity";

@Entity("user_roles")
export class UserRole {
  @PrimaryColumn({ name: "user_id" })
  userId: number;

  @PrimaryColumn({ name: "role_id" })
  roleId: number;

  @ManyToOne(() => User, user => user.userRoles)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Role, role => role.userRoles)
  @JoinColumn({ name: "role_id" })
  role: Role;
}
