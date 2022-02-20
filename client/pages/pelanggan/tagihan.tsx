import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import styles from "../../styles/tagihan.module.css";
import { Select } from "chakra-react-select";
import {
    Box,
    Button,
    Center,
    Container,
    Flex,
    Link,
    Spinner,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Select as CSelect,
    FormLabel,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import NextLink from "next/link";
import { ParsedUrlQuery } from "querystring";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { Customer, Query, Usage } from "../../@types";
import api from "../../utils/api";
import toCurrency from "../../utils/toCurrency";
import toOptions from "../../utils/toOptions";
import toPeriod from "../../utils/toPeriod";

interface BillQuery extends Partial<Query> {
    sudah_dibayar: "0" | "1" | "";
    id_pelanggan: string;
}

interface Props {
    routerQuery: ParsedUrlQuery;
    customers: Customer[];
}

const BillTable: FC<Props> = ({ routerQuery, customers }) => {
    const customerOptions = toOptions(customers, "id_pelanggan", "nama", {
        label: "Semua",
        value: "",
    });

    const [usages, setUsages] = useState<Usage[]>([]);
    const [query, setQuery] = useState<BillQuery>({
        search: "",
        sudah_dibayar: "",
        id_pelanggan: "",
        ...routerQuery,
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

    const handleChangeQuery = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setQuery({
            ...query,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <Container maxW="container.xl">
                <Box m="3">
                    <FormLabel>Filter</FormLabel>
                    <Flex flexDir={"row"}>
                        <Box>
                            <CSelect
                                value={query.sudah_dibayar}
                                name="sudah_dibayar"
                                onChange={handleChangeQuery}>
                                <option value="">Semua</option>
                                <option value="0">Belum Dibayar</option>
                                <option value="1">Sudah Dibayar</option>
                            </CSelect>
                        </Box>

                        <Box flexGrow={1}>
                            <Select
                                id="golongan"
                                instanceId="golongan-select"
                                name="golongan"
                                options={customerOptions}
                                value={{
                                    value: query.id_pelanggan || "0",
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
                    </Flex>
                </Box>
            </Container>

            <Container maxW="container.xl">
                {typeof usages.length === "number" ? (
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>Id Pemakaian</Th>
                                <Th>Pelanggan</Th>
                                <Th>Meter Awal</Th>
                                <Th>Meter akhir</Th>
                                <Th>Periode</Th>
                                <Th>Total Bayar</Th>
                                <Th>Total Pemakaian</Th>
                                <Th>Sudah Dibayar</Th>
                                <Th>Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {usages.map((usage) => {
                                return (
                                    <Tr key={usage.id_pemakaian}>
                                        <Td>{usage.id_pemakaian}</Td>
                                        <Td>{usage.pelanggan?.nama}</Td>
                                        <Td>{usage.meter_awal}</Td>
                                        <Td>{usage.meter_akhir}</Td>
                                        <Td>{toPeriod(usage.tanggal)}</Td>
                                        <Td>{toCurrency(usage.tagihan.total_bayar)}</Td>
                                        <Td>{usage.tagihan.total_pemakaian}</Td>
                                        <Td>{usage.pembayaran ? <CheckIcon /> : <CloseIcon />}</Td>
                                        <Td>
                                            <Flex justifyContent="space-evenly">
                                                {!usage.pembayaran && (
                                                    <>
                                                        <Button>
                                                            <NextLink
                                                                href={`/pelanggan/${usage.pelanggan?.id_pelanggan}/pemakaian/${usage.id_pemakaian}`}>
                                                                Edit Pemakaian
                                                            </NextLink>
                                                        </Button>
                                                        <Button>
                                                            <NextLink
                                                                href={`/pembayaran/pemakaian/${usage.id_pemakaian}`}
                                                                passHref>
                                                                <Link>Bayar</Link>
                                                            </NextLink>
                                                        </Button>
                                                    </>
                                                )}
                                            </Flex>
                                        </Td>
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                ) : (
                    <Center>
                        <Spinner />
                    </Center>
                )}
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

export default BillTable;
