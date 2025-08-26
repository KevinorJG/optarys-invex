import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { UserStatus } from "./user-status.entity";
import { Tenant } from "./tenant.entity";
import { UserRole } from "./user-role.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", unique: true, name: "external_id" })
  externalId: string;

  @Column({ name: "first_name" })
  firstName: string;

  @Column({ name: "last_name" })
  lastName: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @ManyToOne(() => Tenant, { nullable: true })
  @JoinColumn({ name: "tenant_id" })
  tenant: Tenant;

  @ManyToOne(() => UserStatus)
  @JoinColumn({ name: "status_id" })
  status: UserStatus;

  @Column({ type: "boolean", name: "is_active", default: true })
  isActive: boolean;

  @OneToMany(() => UserRole, ur => ur.userId)
  userRoles: UserRole[];
}
