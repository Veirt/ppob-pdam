import * as argon2 from "argon2";
import {
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import PembayaranPelanggan from "./PembayaranPelanggan";
import RolePetugas from "./RolePetugas";

@Entity()
class Petugas {
    @PrimaryGeneratedColumn()
    id_petugas!: number;

    @Column({ type: "varchar", length: 255 })
    nama!: string;

    @Column({ type: "varchar", length: 30 })
    username!: string;

    @Column({ type: "varchar", length: 255, select: false })
    password!: string;

    // Role bisa punya banyak petugas
    // Petugas hanya bisa punya 1 role
    @ManyToOne(() => RolePetugas, (role) => role.petugas)
    @JoinColumn({ name: "role" })
    role!: RolePetugas;

    @OneToMany(() => PembayaranPelanggan, (pembayaran) => pembayaran.petugas)
    pembayaran!: PembayaranPelanggan;

    async verifyPassword(rawPassword: string) {
        const verified = await argon2.verify(this.password, rawPassword);
        return verified;
    }

    @BeforeInsert()
    async hashPassword() {
        if (!this.password) return;

        this.password = await argon2.hash(this.password);
    }
}

export default Petugas;
