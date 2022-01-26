import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Petugas from "./Petugas";

@Entity({ name: "role_petugas" })
class RolePetugas {
    @PrimaryGeneratedColumn()
    id_role!: number;

    @Column({ type: "varchar", length: 30 })
    nama_role!: string;

    @OneToMany(() => Petugas, (petugas) => petugas.role)
    petugas!: Petugas[];
}

export default RolePetugas;
