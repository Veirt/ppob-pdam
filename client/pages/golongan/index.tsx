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
import { Golongan, Query } from "../../@types";
import DeleteWithAlert from "../../components/alert";
import api from "../../utils/api";

const Golongan = () => {
    const toast = useToast();

    const [categories, setCategory] = useState<Golongan[]>([]);
    const [query, setQuery] = useState<Query>({ search: "" });

    const fetchGolongan = async () => {
        const res = await api.get("/golongan", { params: query });
        setCategory(res.data);
    };

    useEffect(() => {
        fetchGolongan();
    }, [query]);

    const handleChangeQuery = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery({
            ...query,
            [e.target.name]: e.target.value,
        });
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/golongan/${id}`);
            toast({
                position: "top-right",
                title: "Success",
                description: "Berhasil menghapus golongan",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            console.error(err);
        } finally {
            fetchGolongan();
        }
    };

    return (
        <>
            <Container maxW="container.lg">
                <Box m={3}>
                    <Button colorScheme="green">
                        <NextLink href="/golongan/create">Tambah Golongan</NextLink>
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
                            <Th>Id Golongan</Th>
                            <Th>Nama Golongan</Th>
                            <Th>Tarif</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {categories.map((category) => {
                            return (
                                <Tr key={category.id_golongan}>
                                    <Td>{category.id_golongan}</Td>
                                    <Td>{category.nama_golongan}</Td>
                                    <Td>Tarif</Td>
                                    <Td>
                                        <Flex justifyContent="space-evenly">
                                            <NextLink href={`/golongan/${category.id_golongan}`}>
                                                <Button colorScheme={"green"}>Edit</Button>
                                            </NextLink>
                                            <DeleteWithAlert
                                                title="Delete Golongan"
                                                onClick={() =>
                                                    handleDelete(category.id_golongan as number)
                                                }>
                                                Apakah anda yakin untuk menghapus golongan bernama
                                                {` ${category.nama_golongan}`}?
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

export default Golongan;
