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
import DeleteWithAlert from "@components/alert";
import Pagination from "@components/pagination";
import { useAuth } from "@components/providers/UserProvider";
import Toast from "@lib/toast";
import type { Golongan, Query } from "@types";
import api, { isAxiosError } from "@utils/api";
import NextLink from "next/link";
import { GetServerSideProps } from "next/types";
import type { ParsedUrlQuery } from "querystring";
import { ChangeEvent, FC, useEffect, useState } from "react";

interface Props {
    routerQuery: ParsedUrlQuery;
}

const GolonganTable: FC<Props> = ({ routerQuery }) => {
    const toast = useToast();

    const { loadingUser } = useAuth();

    const [categories, setCategory] = useState<Golongan[]>([]);
    const [query, setQuery] = useState<Query>({ search: "", take: 10, skip: 0, ...routerQuery });
    const [count, setCount] = useState(0);
    const [isLoading, setLoading] = useState(false);

    const fetchGolongan = async () => {
        setLoading(true);

        try {
            const res = await api.get("/golongan", { params: query });

            setCategory(res.data.result);
            setCount(res.data.count);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
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
            if (isAxiosError(err)) {
                Toast(toast, "any", err.response?.data.message);
            }
        } finally {
            fetchGolongan();
        }
    };

    return (
        <>
            {!loadingUser && (
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
                            placeholder="Cari golongan..."
                        />
                    </Box>

                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Id Golongan</Th>
                                <Th>Nama Golongan</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {categories.map((category) => {
                                return (
                                    <Tr key={category.id_golongan}>
                                        <Td>{category.id_golongan}</Td>
                                        <Td>{category.nama_golongan}</Td>
                                        <Td>
                                            <Flex justifyContent="space-evenly">
                                                <NextLink
                                                    href={`/golongan/${category.id_golongan}`}>
                                                    <Button colorScheme={"green"}>Edit</Button>
                                                </NextLink>
                                                <DeleteWithAlert
                                                    title="Delete Golongan"
                                                    onClick={() =>
                                                        handleDelete(category.id_golongan as number)
                                                    }>
                                                    Apakah anda yakin untuk menghapus golongan
                                                    bernama
                                                    {` ${category.nama_golongan}`}?
                                                </DeleteWithAlert>
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
                </Container>
            )}
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

export default GolonganTable;
