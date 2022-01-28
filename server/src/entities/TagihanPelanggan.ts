import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import PembayaranPelanggan from "./PembayaranPelanggan";

@Entity({ name: "tagihan_pelanggan" })
class TagihanPelanggan {
    @PrimaryGeneratedColumn()
    id_tagihan!: number;

    @Column({ type: "int" })
    total_pemakaian!: number;

    @Column({ type: "int" })
    total_bayar!: number;

    @OneToOne(() => PembayaranPelanggan)
    @JoinColumn({ name: "pembayaran" })
    pembayaran?: PembayaranPelanggan;
}

export default TagihanPelanggan;
