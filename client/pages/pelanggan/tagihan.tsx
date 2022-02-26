import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Center,
    Container,
    Flex,
    FormLabel,
    Link,
    Select as CSelect,
    Spinner,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { GetServerSideProps } from "next";
import NextLink from "next/link";
import { ParsedUrlQuery } from "querystring";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { Customer, Query, Usage } from "../../@types";
import Pagination from "../../components/pagination";
import api from "../../utils/api";
import toCurrency from "../../utils/toCurrency";
import toOptions from "../../utils/toOptions";
import toPeriod from "../../utils/toPeriod";

interface BillQuery extends Partial<Query> {
    sudah_dibayar: "0" | "1" | "";
    id_pelanggan: string;
    periode: string;
}

interface Props {
    routerQuery: ParsedUrlQuery;
    customers: Customer[];
    period: { month: number; year: number }[];
}

const BillTable: FC<Props> = ({ routerQuery, customers, period }) => {
    const customerOptions = toOptions(customers, "id_pelanggan", "nama", {
        label: "Semua Pelanggan",
        value: "",
    });
    const [isLoading, setLoading] = useState(false);

    const [usages, setUsages] = useState<Usage[]>([]);
    const [query, setQuery] = useState<BillQuery>({
        search: "",
        sudah_dibayar: "",
        id_pelanggan: "",
        take: 10,
        skip: 0,
        periode: "",
        ...routerQuery,
    });
    const [label, setLabel] = useState(
        routerQuery.id_pelanggan
            ? customers.find((customer) => customer.id_pelanggan == routerQuery.id_pelanggan)?.nama
            : "Semua Pelanggan"
    );
    const [count, setCount] = useState(0);

    const fetchUsage = async () => {
        setLoading(true);

        try {
            const res = await api.get("/pelanggan/pemakaian", { params: query });
            setUsages(res.data.result);
            setCount(res.data.count);
        } catch (err) {
            console.error(`Error when fetching tagihan: ${err}`);
        } finally {
            setLoading(false);
        }
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

                        <Box flexGrow={1}>
                            <Select
                                id="periode"
                                instanceId="periode-select"
                                name="periode"
                                options={(() => {
                                    const initial = { label: "Semua Periode", value: "" };

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
            </Container>

            <Container maxW="container.xl">
                {typeof usages.length === "number" ? (
                    <>
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
                                            <Td>
                                                {usage.pembayaran ? <CheckIcon /> : <CloseIcon />}
                                            </Td>
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
                        <Pagination
                            isLoading={isLoading}
                            query={query}
                            setQuery={setQuery}
                            count={count}
                        />
                    </>
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

export default BillTable;
