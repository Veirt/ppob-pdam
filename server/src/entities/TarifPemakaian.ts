import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import GolonganPelanggan from "./GolonganPelanggan";

// Tiap golongan pelanggan punya tarif
// 1 Golongan bisa punya banyak tarif
@Entity({ name: "tarif_pemakaian" })
class TarifPemakaian {
    @PrimaryGeneratedColumn()
    id_tarif!: number;

    @Column({ type: "int" })
    kubik_awal!: number;

    @Column({ type: "int" })
    kubik_akhir!: number;

    @Column({ type: "bigint" })
    tarif!: number;

    @ManyToOne(() => GolonganPelanggan, (golongan) => golongan.tarif)
    @JoinColumn({ name: "golongan_fk" })
    golongan!: GolonganPelanggan;
}

export default TarifPemakaian;