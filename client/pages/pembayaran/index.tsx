import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import {
    Box,
    Button,
    Container,
    Input,
    Link,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { useState } from "react";
import { Customer } from "../../@types";
import api from "../../utils/api";
import toCurrency from "../../utils/toCurrency";

const Payment = () => {
    const [customer, setCustomer] = useState<Customer>({
        id_pelanggan: "",
        nama: "",
        alamat: "",
        golongan: { id_golongan: 0 },
    });

    const handleClick = async () => {
        const res = await api.get(`/pelanggan/${customer.id_pelanggan}`);
        setCustomer(res.data);
    };

    return (
        <>
            <Container maxW="container.md">
                <Box m={3}>
                    <Input
                        name="search"
                        type={"number"}
                        placeholder="Masukkan ID Pelanggan"
                        value={customer.id_pelanggan}
                        onChange={(e) => {
                            setCustomer({
                                ...customer,
                                id_pelanggan: e.target.value,
                            });
                        }}
                    />
                    <Button onClick={handleClick}>Lanjut</Button>
                </Box>
            </Container>
            <Container maxW="container.lg">
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Id Pemakaian</Th>
                            <Th>Meter Awal</Th>
                            <Th>Meter akhir</Th>
                            <Th>Periode</Th>
                            <Th>Total Bayar</Th>
                            <Th>Total Pemakaian</Th>
                            <Th>Denda</Th>
                            <Th>Sudah Dibayar</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {customer.pemakaian?.map((pemakaian) => {
                            return (
                                <Tr key={pemakaian.id_pemakaian}>
                                    <Td>{pemakaian.id_pemakaian}</Td>
                                    <Td>{pemakaian.meter_awal}</Td>
                                    <Td>{pemakaian.meter_akhir}</Td>
                                    <Td>{pemakaian.tanggal}</Td>
                                    <Td>
                                        {toCurrency(
                                            pemakaian.tagihan.total_bayar
                                        )}
                                    </Td>
                                    <Td>{pemakaian.tagihan.total_pemakaian}</Td>
                                    <Td>{toCurrency(pemakaian.denda)}</Td>
                                    <Td>
                                        {pemakaian.pembayaran ? (
                                            <CheckIcon />
                                        ) : (
                                            <CloseIcon />
                                        )}
                                    </Td>
                                    <Td>
                                        {!pemakaian.pembayaran && (
                                            <Button>
                                                <NextLink
                                                    href={`/pemakaian/${pemakaian.id_pemakaian}`}
                                                    passHref
                                                >
                                                    <Link>Bayar</Link>
                                                </NextLink>
                                            </Button>
                                        )}

                                        <Button>Edit TODO</Button>
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

export default Payment;
