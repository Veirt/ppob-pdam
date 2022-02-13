import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Center,
    Container,
    Input,
    InputGroup,
    InputRightElement,
    Link,
    Spinner,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { FormEvent } from "react";
import { Customer } from "../../../../@types";
import useFetch from "../../../../hooks/useFetch";
import toCurrency from "../../../../utils/toCurrency";
import toPeriod from "../../../../utils/toPeriod";

const Payment = () => {
    const router = useRouter();
    const { id } = router.query;

    const [customer, setCustomer] = useFetch<Customer>(`/pelanggan/${id}`, {
        id_pelanggan: "",
        nama: "",
        alamat: "",
        golongan: { id_golongan: 0 },
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        router.replace(`/pelanggan/${customer.id_pelanggan}/tagihan`);
    };

    return (
        <>
            <Container maxW="container.lg">
                <form onSubmit={handleSubmit}>
                    <Box m={3}>
                        <InputGroup size="md">
                            <Input
                                pr="4.5rem"
                                type="text"
                                onChange={(e) => {
                                    setCustomer({
                                        ...customer,
                                        id_pelanggan: e.target.value,
                                    });
                                }}
                                placeholder="Masukkan ID Pelanggan"
                            />
                            <InputRightElement width="4.5rem">
                                <Button h="1.75rem" size="sm" onClick={handleSubmit}>
                                    Lanjut
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </Box>
                </form>
            </Container>
            <Container maxW="container.lg">
                {customer.pemakaian ? (
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
                                        <Td>{toPeriod(pemakaian.tanggal)}</Td>
                                        <Td>{toCurrency(pemakaian.tagihan.total_bayar)}</Td>
                                        <Td>{pemakaian.tagihan.total_pemakaian}</Td>
                                        <Td>{toCurrency(pemakaian.denda)}</Td>
                                        <Td>
                                            {pemakaian.pembayaran ? <CheckIcon /> : <CloseIcon />}
                                        </Td>
                                        <Td>
                                            {!pemakaian.pembayaran && (
                                                <Button>
                                                    <NextLink
                                                        href={`/pemakaian/${pemakaian.id_pemakaian}`}
                                                        passHref>
                                                        <Link>Bayar</Link>
                                                    </NextLink>
                                                </Button>
                                            )}
                                        </Td>
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                ) : (
                    <Center>
                        <Spinner />
                    </Center>
                )}
            </Container>
        </>
    );
};

export default Payment;
