import { Container, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import Pagination from "@components/pagination";
import type { Payment, Query } from "@types";
import api from "@utils/api";
import toCurrency from "@utils/toCurrency";
import toPeriod from "@utils/toPeriod";
import type { GetServerSideProps } from "next";
import type { ParsedUrlQuery } from "querystring";
import { FC, useEffect, useState } from "react";

interface Props {
    routerQuery: ParsedUrlQuery;
}

const PaymentTable: FC<Props> = ({ routerQuery }) => {
    const [isLoading, setLoading] = useState(false);

    const [payments, setPayments] = useState<Payment[]>([]);
    const [query, setQuery] = useState<Query>({ take: 20, skip: 0, search: "", ...routerQuery });
    const [count, setCount] = useState(0);

    const fetchPayment = async () => {
        setLoading(true);

        try {
            const res = await api.get("/pembayaran", { params: query });
            setPayments(res.data.result);
            setCount(res.data.count);
        } catch (err) {
            console.error(`Error when fetching pembayaran: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayment();
    }, [query]);

    return (
        <>
            <Container maxW="container.xl">
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Id Pembayaran</Th>
                            <Th>Nama</Th>
                            <Th>Tanggal Bayar</Th>
                            <Th isNumeric>Pemakaian</Th>
                            <Th>Periode Pemakaian</Th>
                            <Th>Total Bayar</Th>
                            <Th>Biaya Admin</Th>
                            <Th>Denda</Th>
                            <Th>Petugas</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {payments.map((payment) => {
                            if (payment.pemakaian)
                                return (
                                    <Tr key={payment.id_pembayaran}>
                                        <Td>{payment.id_pembayaran}</Td>
                                        <Td>{payment.pemakaian?.pelanggan?.nama}</Td>
                                        <Td>
                                            {new Date(payment.tanggal_bayar).toLocaleString(
                                                "id-ID"
                                            )}
                                        </Td>
                                        <Td isNumeric>
                                            {`${payment.pemakaian?.meter_awal} - ${payment.pemakaian?.meter_akhir} `}
                                        </Td>
                                        <Td>{toPeriod(payment.pemakaian?.tanggal)}</Td>
                                        <Td>{toCurrency(payment.tagihan?.total_bayar)}</Td>
                                        <Td>{toCurrency(payment.biaya_admin)}</Td>
                                        <Td>{toCurrency(payment.pemakaian?.denda)}</Td>
                                        <Td>{payment.petugas?.nama ?? "Petugas Sudah Keluar"}</Td>
                                    </Tr>
                                );
                        })}
                    </Tbody>
                </Table>
                <Pagination isLoading={isLoading} query={query} setQuery={setQuery} count={count} />
            </Container>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: {
            routerQuery: context.query,
        },
    };
};

export default PaymentTable;
