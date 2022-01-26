import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import GolonganPelanggan from "./GolonganPelanggan";
import PemakaianPelanggan from "./PemakaianPelanggan";

@Entity()
class Pelanggan {
    @PrimaryGeneratedColumn()
    id_pelanggan!: number;

    @Column({ type: "varchar", length: 255 })
    nama!: string;

    @Column({ type: "text" })
    alamat!: string;

    @ManyToOne(() => GolonganPelanggan, (golongan) => golongan.pelanggan)
    @JoinColumn({ name: "golongan" })
    golongan!: GolonganPelanggan;

    @OneToMany(() => PemakaianPelanggan, (pemakaian) => pemakaian.pelanggan)
    pemakaian!: PemakaianPelanggan[];
}
export default Pelanggan;
