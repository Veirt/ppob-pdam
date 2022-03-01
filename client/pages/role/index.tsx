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
import Pagination from "../../components/pagination";
import api, { isAxiosError } from "../../utils/api";

const RoleTable = () => {
    const toast = useToast();
    const [isLoading, setLoading] = useState(false);

    const [roles, setRoles] = useState<Role[]>([]);
    const [query, setQuery] = useState<Query>({ search: "", take: 10, skip: 0 });
    const [count, setCount] = useState(0);

    const fetchRole = async () => {
        setLoading(true);

        try {
            const res = await api.get("/petugas/role", { params: query });
            setRoles(res.data);
        } catch (err) {
            console.error(`Error when fetching role: ${err}`);
        } finally {
            setLoading(false);
        }
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
            if (isAxiosError(err)) {
                toast({
                    position: "top-right",
                    title: "Error",
                    description: err.response!.data.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
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
                                                <Button colorScheme="green">Edit</Button>
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
                <Pagination isLoading={isLoading} query={query} setQuery={setQuery} count={count} />
            </Container>
        </>
    );
};

export default RoleTable;
