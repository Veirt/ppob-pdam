import { Box, Button, Container, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { FC, FormEvent, useState } from "react";
import { Customer } from "../../../@types";
import api from "../../../utils/api";

interface Props {
    routerQuery: ParsedUrlQuery;
}

const AltPayment: FC<Props> = ({ routerQuery }) => {
    const [customer, setCustomer] = useState<Customer>({
        id_pelanggan: "",
        nama: "",
        alamat: "",
        golongan: { id_golongan: 0, nama_golongan: "" },
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const res = await api.get(
            `/pelanggan/pemakaian?sudah_dibayar=0&id_pelanggan=${customer.id_pelanggan}`
        );
    };

    return (
        <Container maxW="xl">
            <Box my="3">
                <form method="POST" onSubmit={handleSubmit}>
                    <InputGroup size="md">
                        <Input
                            pr="4.5rem"
                            name="id_pelanggan"
                            placeholder="Cari Pelanggan..."
                            onChange={(e) =>
                                setCustomer({ ...customer, id_pelanggan: e.target.value })
                            }
                        />
                        <InputRightElement width="4.5rem">
                            <Button type="submit" size="sm">
                                Search
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </form>
            </Box>
        </Container>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: {
            routerQuery: context.query,
        },
    };
};

export default AltPayment;
