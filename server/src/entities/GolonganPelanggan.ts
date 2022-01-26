import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Pelanggan from "./Pelanggan";

@Entity({ name: "golongan_pelanggan" })
class GolonganPelanggan {
    @PrimaryGeneratedColumn()
    id_golongan!: number;

    @Column({ type: "varchar", length: 255 })
    nama!: string;

    @OneToMany(() => Pelanggan, (pelanggan) => pelanggan.golongan)
    pelanggan!: Pelanggan[];
}

export default GolonganPelanggan;
