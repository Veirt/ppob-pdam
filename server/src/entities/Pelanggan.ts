import {
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from "typeorm";
import GolonganPelanggan from "./GolonganPelanggan";
import PemakaianPelanggan from "./PemakaianPelanggan";

@Entity()
class Pelanggan {
    @PrimaryColumn({ type: "bigint" })
    id_pelanggan!: number;

    @Column({ type: "varchar", length: 255 })
    nama!: string;

    @Column({ type: "text" })
    alamat!: string;

    @ManyToOne(() => GolonganPelanggan, (golongan) => golongan.pelanggan)
    @JoinColumn({ name: "golongan" })
    golongan!: GolonganPelanggan;

    @OneToMany(() => PemakaianPelanggan, (pemakaian) => pemakaian.pelanggan, {
        onDelete: "CASCADE",
    })
    pemakaian!: PemakaianPelanggan[];

    sudah_dicatat?: boolean;
}
export default Pelanggan;
