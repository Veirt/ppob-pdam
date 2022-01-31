import { Container, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Customer } from "../../@types";

const Pelanggan = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        const fetchPelanggan = async () => {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/pelanggan`
            );
            setCustomers(res.data);
        };

        fetchPelanggan();
    }, []);

    return (
        <>
            <Container maxW="container.md">
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Id Pelangagn</Th>
                            <Th>Alamat</Th>
                            <Th>Nama</Th>
                            <Th>Golongan</Th>
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
