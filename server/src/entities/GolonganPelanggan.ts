import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Pelanggan from "./Pelanggan";
import TarifPemakaian from "./TarifPemakaian";

@Entity({ name: "golongan_pelanggan" })
class GolonganPelanggan {
    @PrimaryGeneratedColumn()
    id_golongan!: number;

    @Column({ type: "varchar", length: 255 })
    nama_golongan!: string;

    @OneToMany(() => Pelanggan, (pelanggan) => pelanggan.golongan)
    pelanggan!: Pelanggan[];

    @OneToMany(() => TarifPemakaian, (tarif) => tarif.golongan)
    tarif!: TarifPemakaian[];
}

export default GolonganPelanggan;
