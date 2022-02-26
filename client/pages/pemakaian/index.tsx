import { Box, Button, Container, Flex, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { GetServerSideProps } from "next";
import NextLink from "next/link";
import { ParsedUrlQuery } from "querystring";
import { FC, useEffect, useState } from "react";
import { Customer, Query, Usage } from "../../@types";
import Pagination from "../../components/pagination";
import api from "../../utils/api";
import toOptions from "../../utils/toOptions";
import toPeriod from "../../utils/toPeriod";

interface UsageQuery extends Query {
    id_pelanggan: string;
    periode: string;
}

interface Props {
    routerQuery: ParsedUrlQuery;
    customers: Customer[];
    period: { month: number; year: number }[];
}

const UsageTable: FC<Props> = ({ routerQuery, customers, period }) => {
    const customerOptions = toOptions(customers, "id_pelanggan", "nama", {
        label: "Semua",
        value: "",
    });
    const [isLoading, setLoading] = useState(false);

    const [usages, setUsages] = useState<Usage[]>([]);
    const [query, setQuery] = useState<UsageQuery>({
        id_pelanggan: "",
        periode: "",
        take: 10,
        skip: 0,
        ...routerQuery,
    });
    const [label, setLabel] = useState(
        routerQuery.id_pelanggan
            ? customers.find((customer) => customer.id_pelanggan == routerQuery.id_pelanggan)?.nama
            : "Semua"
    );
    const [count, setCount] = useState(0);

    const fetchUsage = async () => {
        setLoading(true);

        try {
            const res = await api.get("/pelanggan/pemakaian", { params: query });
            setUsages(res.data.result);
            setCount(res.data.count);
        } catch (err) {
            console.error(`Error when fetching pemakaian: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsage();
    }, [query]);

    return (
        <>
            <Container maxW="container.lg">
                <Box m={3}>
                    <Select
                        id="golongan"
                        instanceId="golongan-select"
                        name="golongan"
                        options={customerOptions}
                        value={{
                            value: query.id_pelanggan || 0,
                            label,
                        }}
                        onChange={(v) => {
                            setQuery({
                                ...query,
                                id_pelanggan: v!.value as string,
                            });
                            setLabel(v!.label);
                        }}
                    />

                    <Select
                        id="periode"
                        instanceId="periode-select"
                        name="periode"
                        options={(() => {
                            const initial = { label: "Semua", value: "" };

                            const periodOptions = period.map((p) => ({
                                value: `${p.year}-${p.month}`,
                                label: toPeriod(new Date(`${p.year}-${p.month}`)),
                            }));
                            periodOptions.unshift(initial);

                            return periodOptions;
                        })()}
                        value={{
                            value: query.periode ?? "",
                            label: query.periode
                                ? toPeriod(new Date(query.periode))
                                : "Semua periode",
                        }}
                        onChange={(v) => {
                            setQuery({
                                ...query,
                                periode: v!.value as string,
                            });
                        }}
                    />
                </Box>

                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Id Pemakaian</Th>
                            <Th>Periode</Th>
                            <Th>Meter Awal</Th>
                            <Th>Meter Akhir</Th>
                            <Th>Pelanggan</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {usages.map((usage) => {
                            return (
                                <Tr key={usage.id_pemakaian}>
                                    <Td>{usage.id_pemakaian}</Td>
                                    <Td>{toPeriod(usage.tanggal)}</Td>
                                    <Td>{usage.meter_awal}</Td>
                                    <Td>{usage.meter_akhir}</Td>
                                    <Td>{usage.pelanggan!.nama}</Td>
                                    <Td>
                                        <Flex justifyContent="space-evenly">
                                            <NextLink
                                                href={`/pelanggan/${
                                                    usage.pelanggan!.id_pelanggan
                                                }/pemakaian/${usage.id_pemakaian}`}>
                                                <Button
                                                    disabled={usage.pembayaran !== null}
                                                    colorScheme="green">
                                                    Edit
                                                </Button>
                                            </NextLink>
                                        </Flex>
                                    </Td>
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
    const headers = { Cookie: `connect.sid=${context.req.cookies["connect.sid"]}` };

    const res = await api.get("/pelanggan", { headers });
    const customers = res.data.result;

    const period = await api.get("/pelanggan/pemakaian/periode", { headers });

    return {
        props: {
            routerQuery: context.query,
            customers,
            period: period.data,
        },
    };
};

export default UsageTable;
