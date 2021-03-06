import {
    Box,
    Button,
    Container,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { useAuth } from "@components/providers/UserProvider";
import Toast from "@lib/toast";
import { Employee, Usage, ValidationError } from "@types";
import api, { isAxiosError } from "@utils/api";
import toCurrency from "@utils/toCurrency";
import toPeriod from "@utils/toPeriod";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface IPaymentState {
    pemakaian: Usage;
    biaya_admin: number;
    petugas: Employee;
}

const UsageForm: FC<{ routerParams: ParsedUrlQuery }> = ({ routerParams }) => {
    const router = useRouter();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();

    useEffect(() => {
        async function fetchUsage() {
            const res = await api.get(`/pelanggan/pemakaian/${routerParams.id}`);
            setPayment({ ...payment, pemakaian: res.data });
        }

        fetchUsage();
    }, []);

    const { user } = useAuth();

    const [isLoading, setLoading] = useState(false);
    const [receipt, setReceipt] = useState({ base64: "", blob: "" });

    const [payment, setPayment] = useState<IPaymentState>({
        petugas: user as Employee,
        pemakaian: {
            tagihan: { total_bayar: 0, total_pemakaian: 0 },
            denda: 0,
            tanggal: new Date(),
            meter_awal: 0,
            pembayaran: null,
            meter_akhir: 0,
            id_pemakaian: 0,
            pelanggan: {
                id_pelanggan: 0,
                nama: "",
                alamat: "",
                golongan: { id_golongan: 0, nama_golongan: "" },
            },
        },
        biaya_admin: 2500,
    });

    const handlePayment = async () => {
        onAlertClose();
        setLoading(true);

        try {
            const res = await api.post(
                "/pembayaran",
                {
                    ...payment,
                    petugas: user,
                    bayar: true,
                },
                { responseType: "arraybuffer" }
            );

            const pdfBlob = new Blob([res.data], {
                type: "application/pdf",
            });
            const blobUrl = URL.createObjectURL(pdfBlob);

            setReceipt({
                base64: `data:application/pdf;base64,${Buffer.from(res.data).toString("base64")}`,
                blob: blobUrl,
            });

            onOpen();
        } catch (err) {
            if (isAxiosError(err)) {
                if (err.response) {
                    const enc = new TextDecoder("utf-8");

                    JSON.parse(enc.decode(err.response.data)).forEach(
                        (validationError: ValidationError) => {
                            Toast(toast, "any", validationError.message);
                        }
                    );
                } else {
                    console.error(err);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onAlertOpen();
    };

    const handlePrint = async () => {
        await import("print-js").then((printjs) => {
            printjs.default({ printable: receipt.blob, type: "pdf", showModal: true });
        });
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPayment({ ...payment, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Container>
                <form onSubmit={handleSubmit} action="POST">
                    <Box my={3}>
                        <FormLabel>Nama Pelanggan</FormLabel>
                        <Input
                            type="text"
                            value={payment.pemakaian.pelanggan?.nama || ""}
                            disabled
                        />
                    </Box>

                    <Box my={3}>
                        <FormLabel>Golongan</FormLabel>
                        <Input
                            type="text"
                            value={payment.pemakaian.pelanggan?.golongan.nama_golongan || ""}
                            disabled
                        />
                    </Box>

                    <Box my={3}>
                        <FormLabel>Meteran</FormLabel>
                        <Input
                            type="text"
                            value={`${payment.pemakaian.meter_awal} - ${payment.pemakaian.meter_akhir}`}
                            disabled
                        />
                    </Box>

                    <Box my={3}>
                        <FormLabel>Periode Pemakaian</FormLabel>
                        <Input type="text" value={toPeriod(payment.pemakaian.tanggal)} disabled />
                    </Box>

                    <Box my={3}>
                        <FormLabel>Total Pemakaian</FormLabel>
                        <Input
                            type="text"
                            value={payment.pemakaian.tagihan.total_pemakaian}
                            disabled
                        />
                    </Box>

                    <Box my={3}>
                        <FormLabel>Total Bayar</FormLabel>
                        <Input
                            type="text"
                            value={toCurrency(payment.pemakaian.tagihan.total_bayar)}
                            disabled
                            required
                        />
                    </Box>

                    <Box my={3}>
                        <FormLabel>Denda</FormLabel>
                        <Input
                            type="text"
                            value={toCurrency(payment.pemakaian.denda || 0)}
                            disabled
                            required
                        />
                    </Box>

                    <Box my={3}>
                        <FormLabel htmlFor="biaya_admin">Biaya Admin</FormLabel>
                        <Input
                            disabled
                            id="biaya_admin"
                            type="text"
                            value={toCurrency(payment.biaya_admin) || ""}
                            onChange={handleChange}
                            required
                        />
                    </Box>

                    <Button
                        disabled={!!payment.pemakaian.pembayaran}
                        type="submit"
                        colorScheme="teal"
                        size="md">
                        Bayar
                    </Button>

                    <Modal isOpen={isAlertOpen} onClose={onAlertClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Perhatian</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>Apakah anda yakin ingin membayar?</ModalBody>
                            <ModalFooter>
                                <Button colorScheme="blue" mr={3} onClick={onAlertClose}>
                                    Close
                                </Button>
                                <Button
                                    isLoading={isLoading}
                                    onClick={handlePayment}
                                    colorScheme="green">
                                    Lanjut
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>

                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Pembayaran Sukses</ModalHeader>
                            <ModalBody>
                                {receipt.base64 && (
                                    <Document file={receipt.base64}>
                                        <Page pageNumber={1} />
                                    </Document>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    colorScheme="green"
                                    onClick={() => {
                                        router.back();
                                    }}>
                                    Kembali ke tagihan
                                </Button>
                                <Button onClick={handlePrint}>Print</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </form>
            </Container>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: {
            routerParams: context.params,
        },
    };
};

export default UsageForm;
