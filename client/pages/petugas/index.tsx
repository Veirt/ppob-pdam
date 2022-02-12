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
import { Employee, Query } from "../../@types";
import DeleteWithAlert from "../../components/alert";
import api from "../../utils/api";

const Petugas = () => {
    const toast = useToast();

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [query, setQuery] = useState<Query>({ search: "" });

    const fetchPetugas = async () => {
        const res = await api.get("/petugas", { params: query });
        setEmployees(res.data);
    };

    useEffect(() => {
        fetchPetugas();
    }, [query]);

    const handleChangeQuery = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery({
            ...query,
            [e.target.name]: e.target.value,
        });
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/petugas/${id}`);
            toast({
                position: "top-right",
                title: "Success",
                description: "Berhasil menghapus petugas",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            console.error(err);
        } finally {
            fetchPetugas();
        }
    };

    return (
        <>
            <Container maxW="container.md">
                <Box m={3}>
                    <Button colorScheme="green">
                        <NextLink href="/petugas/create">
                            Tambah Petugas
                        </NextLink>
                    </Button>
                </Box>

                <Box m={3}>
                    <Input
                        name="search"
                        value={query.search}
                        onChange={handleChangeQuery}
                        placeholder="Cari petugas"
                    />
                </Box>

                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Id Petugas</Th>
                            <Th>Nama</Th>
                            <Th>Username</Th>
                            <Th>Role</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {employees.map((employee) => {
                            return (
                                <Tr key={employee.id_petugas}>
                                    <Td>{employee.id_petugas}</Td>
                                    <Td>{employee.nama}</Td>
                                    <Td>{employee.username}</Td>
                                    <Td>{employee.role?.nama_role}</Td>
                                    <Td>
                                        <Flex justifyContent="space-evenly">
                                            <NextLink
                                                href={`/petugas/${employee.id_petugas}`}
                                            >
                                                <Button bgColor="green.300">
                                                    Edit
                                                </Button>
                                            </NextLink>
                                            <DeleteWithAlert
                                                title="Delete Petugas"
                                                onClick={() =>
                                                    handleDelete(
                                                        employee.id_petugas
                                                    )
                                                }
                                            >
                                                Apakah anda yakin untuk
                                                menghapus petugas bernama
                                                {` ${employee.nama}`}?
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

export default Petugas;
