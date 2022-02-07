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
    const toast = useToast();

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [query, setQuery] = useState<Query>({ search: "" });

    const fetchPelanggan = async () => {
        const res = await api.get("/pelanggan", { params: query });
        setCustomers(res.data);
    };

    useEffect(() => {
        fetchPelanggan();
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
            fetchPelanggan();
        }
    };

    return (
        <>
            <Container maxW="container.md">
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
                                        <Flex>
                                            <NextLink
                                                href={`/pelanggan/${customer.id_pelanggan}`}
                                            >
                                                <Button bgColor={"green.300"}>
                                                    Edit
                                                </Button>
                                            </NextLink>
                                            <DeleteWithAlert
                                                title="Delete Pelanggan"
                                                onClick={() =>
                                                    handleDelete(
                                                        customer.id_pelanggan
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
