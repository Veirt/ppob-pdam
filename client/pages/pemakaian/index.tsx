import { Box, Button, Container, Flex, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import Pagination from "@components/pagination";
import useFetch from "@hooks/useFetch";
import type { Customer, Query, Usage } from "@types";
import api from "@utils/api";
import toOptions from "@utils/toOptions";
import toPeriod from "@utils/toPeriod";
import { Select } from "chakra-react-select";
import type { GetServerSideProps } from "next";
import NextLink from "next/link";
import type { ParsedUrlQuery } from "querystring";
import { FC, useEffect, useState } from "react";

interface UsageQuery extends Query {
    id_pelanggan: string;
    periode: string;
}

interface Props {
    routerQuery: ParsedUrlQuery;
}

const UsageTable: FC<Props> = ({ routerQuery }) => {
    const [customers] = useFetch<Customer[]>("/pelanggan", []);
    const [period] = useFetch<{ year: number; month: number }[]>("pelanggan/pemakaian/periode", []);

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
            <Container maxW="container.xl">
                <Box m={3}>
                    <Flex>
                        <Box flexGrow={1}>
                            <Select
                                id="golongan"
                                instanceId="golongan-select"
                                name="golongan"
                                options={customerOptions}
                                value={{
                                    value: query.id_pelanggan || 0,
                                    label:
                                        customers.find(
                                            (customer) =>
                                                customer.id_pelanggan == query.id_pelanggan
                                        )?.nama ?? "Semua",
                                }}
                                onChange={(v) => {
                                    setQuery({
                                        ...query,
                                        id_pelanggan: v!.value as string,
                                    });
                                }}
                            />
                        </Box>

                        <Box flexGrow={1}>
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
                    </Flex>
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
    return {
        props: {
            routerQuery: context.query,
        },
    };
};

export default UsageTable;
