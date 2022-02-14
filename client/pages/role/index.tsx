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
import { Query, Role } from "../../@types";
import DeleteWithAlert from "../../components/alert";
import api from "../../utils/api";

const RoleTable = () => {
    const toast = useToast();

    const [roles, setRoles] = useState<Role[]>([]);
    const [query, setQuery] = useState<Query>({ search: "" });

    const fetchRole = async () => {
        const res = await api.get("/petugas/role", { params: query });
        setRoles(res.data);
    };

    useEffect(() => {
        fetchRole();
    }, [query]);

    const handleChangeQuery = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery({
            ...query,
            [e.target.name]: e.target.value,
        });
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/petugas/role/${id}`);
            toast({
                position: "top-right",
                title: "Success",
                description: "Berhasil menghapus role",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            console.error(err);
        } finally {
            fetchRole();
        }
    };

    return (
        <>
            <Container maxW="container.lg">
                <Box m={3}>
                    <Button colorScheme="green">
                        <NextLink href="/role/create">Tambah Role</NextLink>
                    </Button>
                </Box>

                <Box m={3}>
                    <Input
                        name="search"
                        value={query.search}
                        onChange={handleChangeQuery}
                        placeholder="Cari role"
                    />
                </Box>

                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Id Role</Th>
                            <Th>Nama Role</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {roles.map((role) => {
                            return (
                                <Tr key={role.id_role}>
                                    <Td>{role.id_role}</Td>
                                    <Td>{role.nama_role}</Td>
                                    <Td>
                                        <Flex justifyContent="space-evenly">
                                            <NextLink href={`/role/${role.id_role}`}>
                                                <Button bgColor="green.300">Edit</Button>
                                            </NextLink>
                                            <DeleteWithAlert
                                                title="Delete Role"
                                                onClick={() => handleDelete(role.id_role)}>
                                                Apakah anda yakin untuk menghapus role bernama
                                                {` ${role.nama_role}`}?
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

export default RoleTable;
