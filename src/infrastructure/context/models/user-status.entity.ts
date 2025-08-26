import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("user_statuses")
export class UserStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", unique: true, name: "external_id" })
  externalId: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;
}
