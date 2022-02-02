import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import Petugas from "./Petugas";
import TagihanPelanggan from "./TagihanPelanggan";

@Entity({ name: "pembayaran_pelanggan" })
class PembayaranPelanggan {
    @PrimaryGeneratedColumn()
    id_pembayaran!: number;

    @Column({ type: "date" })
    tanggal_bayar!: Date;

    @Column({ type: "int" })
    biaya_admin!: number;

    @OneToOne(() => Petugas)
    @JoinColumn({ name: "petugas" })
    petugas!: Petugas;

    @OneToOne(() => TagihanPelanggan, (tagihan) => tagihan.pembayaran)
    tagihan!: TagihanPelanggan;
}

export default PembayaranPelanggan;
