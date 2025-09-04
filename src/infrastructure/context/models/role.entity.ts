import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Tenant } from "./tenant.entity";
import { UserRole } from "./user-role.entity";
import { RolePermission } from "./role-permission.entity";

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", unique: true, name: "external_id" })
  externalId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Tenant, { nullable: true })
  @JoinColumn({ name: "tenant_id" })
  tenant: Tenant;

  @OneToMany(() => UserRole, ur => ur.role) 
  userRoles: UserRole[];

  @OneToMany(() => RolePermission, rp => rp.role)
  rolePermissions: RolePermission[];
}
