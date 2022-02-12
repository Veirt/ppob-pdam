import {
    Box,
    Button,
    Container,
    Flex,
    Input,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useToast,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { Customer, Query } from "../../@types";
import DeleteWithAlert from "../../components/alert";
import api from "../../utils/api";

const Pelanggan = () => {
    const currentMonth = new Date().getMonth();
    const toast = useToast();

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [query, setQuery] = useState<Query>({ search: "" });

    const fetchCustomer = async () => {
        const res = await api.get("/pelanggan", { params: query });
        setCustomers(res.data);
    };

    useEffect(() => {
        fetchCustomer();
    }, [query]);

    const handleChangeQuery = (e: ChangeEvent<HTMLInputElement>) => {
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
            <Container maxW="container.lg">
                <Box m={3}>
                    <Button colorScheme="green">
                        <NextLink href="/pelanggan/create">
                            Tambah Pelanggan
                        </NextLink>
                    </Button>
                </Box>

                <Box m={3}>
                    <Input
                        name="search"
                        value={query.search}
                        onChange={handleChangeQuery}
                        placeholder="Cari pelanggan"
                    />
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
                                            <NextLink
                                                href={`/pelanggan/${customer.id_pelanggan}/pemakaian/create`}
                                            >
                                                <Button
                                                    // disabled ketika sudah diinput bulan ini
                                                    disabled={
                                                        new Date(
                                                            customer.pemakaian!.at(
                                                                -1
                                                            )!.tanggal
                                                        ).getMonth() ===
                                                        currentMonth
                                                    }
                                                    colorScheme={"blue"}
                                                >
                                                    Pemakaian
                                                </Button>
                                            </NextLink>
                                            <NextLink
                                                href={`/pelanggan/${customer.id_pelanggan}`}
                                            >
                                                <Button colorScheme={"green"}>
                                                    Edit
                                                </Button>
                                            </NextLink>
                                            <DeleteWithAlert
                                                title="Delete Customer"
                                                onClick={() =>
                                                    handleDelete(
                                                        customer.id_pelanggan as number
                                                    )
                                                }
                                            >
                                                Apakah anda yakin untuk
                                                menghapus pelanggan bernama
                                                {` ${customer.nama}`}?
                                            </DeleteWithAlert>
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

export default Pelanggan;
