import fs from "fs";
import path from "path";
import pdfkit from "pdfkit";
import type PemakaianPelanggan from "../entities/PemakaianPelanggan";
import type Petugas from "../entities/Petugas";

interface Pemakaian extends PemakaianPelanggan {
    tagihan: {
        total_bayar: number;
        total_pemakaian: number;
    };
}

interface Payment {
    biaya_admin: string; // numeric string
    pemakaian: Pemakaian;
    petugas: Petugas;
}

const now = (dt: Date) => {
    return `${(dt.getMonth() + 1).toString().padStart(2, "0")}-${dt
        .getDate()
        .toString()
        .padStart(2, "0")}-${dt.getFullYear().toString().padStart(4, "0")} ${dt
        .getHours()
        .toString()
        .padStart(2, "0")}-${dt.getMinutes().toString().padStart(2, "0")}-${dt
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;
};

const toCurrency = (num: number | null) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "idr",
    }).format(num || 0);
};

const toPeriod = (date: Date) => {
    return new Date(date).toLocaleString("id-ID", {
        month: "long",
        year: "numeric",
    });
};

const LINE = 27.75;

export default (payment: Payment, date: Date) => {
    const doc = new pdfkit({ size: "A6", margin: 5 });

    const fileName = `receipt-${payment.pemakaian.id_pemakaian}-${now(date)}.pdf`;
    const filePath = path.join(__dirname, "../../data", fileName);

    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    doc.fontSize(12);
    doc.font("Helvetica");

    doc.text("PPOB PDAM").moveDown(5);

    doc.text("Tanggal Bayar").moveDown();
    doc.text("Id Pelanggan").moveDown();
    doc.text("Nama Pelanggan").moveDown();
    doc.text("Jumlah Pemakaian").moveDown();
    doc.text("Periode").moveDown(3);
    doc.text("Total Pembayaran").moveDown();
    doc.text("Total Denda").moveDown();
    doc.text("Biaya Admin").moveDown();

    const sec1 = [
        new Date().toLocaleString("id-ID"),
        payment.pemakaian.pelanggan.id_pelanggan,
        payment.pemakaian.pelanggan.nama,
        payment.pemakaian.tagihan.total_pemakaian,
        toPeriod(payment.pemakaian.tanggal),
    ];

    const x = 120;
    let y = 88.25;

    for (const value of sec1) {
        doc.text(`: ${value}`, x, y).moveDown();
        y += LINE;
    }

    y = y + LINE;

    const sec2 = [
        toCurrency(payment.pemakaian.tagihan.total_bayar),
        toCurrency(payment.pemakaian.denda ?? 0),
        toCurrency(Number(payment.biaya_admin)),
    ];

    for (const value of sec2) {
        doc.text(`: ${value}`, x, y).moveDown();
        y += LINE;
    }

    doc.end();

    return { writeStream, filePath };
};
