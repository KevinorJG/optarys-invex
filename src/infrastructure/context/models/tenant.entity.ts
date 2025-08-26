import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { TenantStatus } from "./tenant-status.entity";

@Entity("tenants")
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", unique: true, name: "external_id" })
  externalId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => TenantStatus)
  @JoinColumn({ name: "status_id" })
  status: TenantStatus;
}
