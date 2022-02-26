import {
    Box,
    Button,
    Container,
    Flex,
    Input,
    Select,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useToast,
} from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import NextLink from "next/link";
import { ParsedUrlQuery } from "querystring";
import { ChangeEvent, useEffect, useState } from "react";
import { Customer, Query } from "../../@types";
import DeleteWithAlert from "../../components/alert";
import Authorization from "../../components/authorization";
import Pagination from "../../components/pagination";
import unauthorizedToast from "../../lib/toast/unauthorized";
import api, { isAxiosError } from "../../utils/api";

interface CustomerQuery extends Query {
    sudah_dicatat: "0" | "1" | "";
}

interface Props {
    routerQuery: ParsedUrlQuery;
}

const Pelanggan: NextPage<Props> = ({ routerQuery }) => {
    const toast = useToast();
    const [isLoading, setLoading] = useState(false);

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [query, setQuery] = useState<CustomerQuery>({
        search: "",
        sudah_dicatat: "",
        take: 10,
        skip: 0,
        ...routerQuery,
    });
    const [count, setCount] = useState(0);

    const fetchCustomer = async () => {
        setLoading(true);

        try {
            const res = await api.get("/pelanggan", { params: query });
            setCustomers(res.data.result);
            setCount(res.data.count);
        } catch (err) {
            if (isAxiosError(err)) {
                if (err.response?.status === 401) unauthorizedToast(toast);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomer();
    }, [query]);

    const handleChangeQuery = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setQuery({
            ...query,
            [e.target.name]: e.target.value,
        });
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/pelanggan/${id}`);
            toast({
                position: "top-right",
                title: "Success",
                description: "Berhasil menghapus pelanggan",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            console.error(err);
        } finally {
            fetchCustomer();
        }
    };

    return (
        <>
            <Container maxW="container.xl">
                <Box m={3}>
                    <Authorization roles={["admin"]}>
                        <Button mr={"3"} colorScheme="green">
                            <NextLink href="/pelanggan/create">Tambah Pelanggan</NextLink>
                        </Button>
                    </Authorization>
                </Box>

                <Box m={3}>
                    <Flex>
                        <Input
                            flexGrow={1}
                            name="search"
                            value={query.search}
                            onChange={handleChangeQuery}
                            placeholder="Cari pelanggan"
                        />
                        <Select
                            name="sudah_dicatat"
                            onChange={handleChangeQuery}
                            value={query.sudah_dicatat}>
                            <option value="">Semua</option>
                            <option value="0">Belum Dicatat bulan ini</option>
                            <option value="1">Sudah dicatat bulan ini</option>
                        </Select>
                    </Flex>
                </Box>

                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Id Pelanggan</Th>
                            <Th>Nama</Th>
                            <Th>Alamat</Th>
                            <Th>Golongan</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {customers.map((customer) => {
                            return (
                                <Tr key={customer.id_pelanggan}>
                                    <Td>{customer.id_pelanggan}</Td>
                                    <Td>{customer.nama}</Td>
                                    <Td>{customer.alamat}</Td>
                                    <Td>{customer.golongan.nama_golongan}</Td>
                                    <Td>
                                        <Flex justifyContent="space-evenly">
                                            <Authorization roles={["petugas meteran"]}>
                                                <NextLink
                                                    href={`/pelanggan/${customer.id_pelanggan}/pemakaian/create`}>
                                                    <Button
                                                        // disabled ketika sudah diinput bulan ini
                                                        disabled={customer.sudah_dicatat}
                                                        colorScheme={"blue"}>
                                                        Tambah Pemakaian
                                                    </Button>
                                                </NextLink>
                                            </Authorization>

                                            <Authorization roles={["petugas meteran"]}>
                                                <NextLink
                                                    href={`/pemakaian?id_pelanggan=${customer.id_pelanggan}`}>
                                                    <Button colorScheme={"blue"}>Pemakaian</Button>
                                                </NextLink>
                                            </Authorization>

                                            <Authorization roles={["petugas loket"]}>
                                                <NextLink
                                                    href={`/pelanggan/tagihan?id_pelanggan=${customer.id_pelanggan}`}>
                                                    <Button colorScheme={"blue"}>Tagihan</Button>
                                                </NextLink>
                                            </Authorization>

                                            <Authorization roles={["admin"]}>
                                                <NextLink
                                                    href={`/pelanggan/${customer.id_pelanggan}`}>
                                                    <Button colorScheme={"green"}>Edit</Button>
                                                </NextLink>
                                            </Authorization>

                                            <Authorization roles={["admin"]}>
                                                <DeleteWithAlert
                                                    title="Delete Customer"
                                                    onClick={() =>
                                                        handleDelete(
                                                            customer.id_pelanggan as number
                                                        )
                                                    }>
                                                    Apakah anda yakin untuk menghapus pelanggan
                                                    bernama
                                                    {` ${customer.nama}`}?
                                                </DeleteWithAlert>
                                            </Authorization>
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

export default Pelanggan;
