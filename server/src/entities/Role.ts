import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Petugas from "./Petugas";

@Entity()
class Role {
  @PrimaryGeneratedColumn()
  id_role!: number;

  @Column({ type: "varchar", length: 30 })
  nama_role!: string;

  @OneToMany(() => Petugas, (petugas) => petugas.role)
  petugas!: Petugas[];
}

export default Role;
