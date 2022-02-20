import { Box, Button, Container, Flex, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { GetServerSideProps } from "next";
import NextLink from "next/link";
import { ParsedUrlQuery } from "querystring";
import { FC, useEffect, useState } from "react";
import { Customer, Query, Usage } from "../../@types";
import api from "../../utils/api";
import toOptions from "../../utils/toOptions";
import toPeriod from "../../utils/toPeriod";

interface UsageQuery extends Partial<Query> {
    id_pelanggan: string;
}

interface Props {
    routerQuery: ParsedUrlQuery;
    customers: Customer[];
}

const UsageTable: FC<Props> = ({ routerQuery, customers }) => {
    const customerOptions = toOptions(customers, "id_pelanggan", "nama", {
        label: "Semua",
        value: "",
    });

    const [usages, setUsages] = useState<Usage[]>([]);
    const [query, setQuery] = useState<UsageQuery>({
        id_pelanggan: (routerQuery.id_pelanggan as string) ?? "",
    });
    const [label, setLabel] = useState(
        routerQuery.id_pelanggan
            ? customers.find((customer) => customer.id_pelanggan == routerQuery.id_pelanggan)?.nama
            : "Semua"
    );

    const fetchUsage = async () => {
        const res = await api.get("/pelanggan/pemakaian", { params: query });
        setUsages(res.data);
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
            </Container>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const res = await api.get("/pelanggan", { withCredentials: true });
    const customers = res.data;

    return {
        props: {
            routerQuery: context.query,
            customers,
        },
    };
};

export default UsageTable;
