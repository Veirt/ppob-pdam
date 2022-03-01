import { Box, Button, CloseButton, Container, Flex, FormLabel, Input } from "@chakra-ui/react";
import { ChangeEvent, Dispatch, FC, FormEvent, SetStateAction } from "react";
import { Tarif } from "../../@types";

export interface GolonganState {
    nama_golongan: string;
    tarif: Tarif[];
}

interface Props {
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleTarifChange: (e: ChangeEvent<HTMLInputElement>, i: number) => void;
    handleSubmit: (e: FormEvent) => void;
    state: GolonganState;
    setState: Dispatch<SetStateAction<GolonganState>>;
    isLoading: boolean;
}

const GolonganForm: FC<Props> = ({
    handleChange,
    handleTarifChange,
    handleSubmit,
    state,
    setState,
    isLoading,
}) => {
    return (
        <>
            <Container>
                <form onSubmit={handleSubmit}>
                    <Box my={3}>
                        <FormLabel htmlFor="nama_golongan">Nama Golongan</FormLabel>
                        <Input
                            id="nama_golongan"
                            name="nama_golongan"
                            type="text"
                            value={state.nama_golongan || ""}
                            onChange={handleChange}
                            required
                        />
                    </Box>

                    <Box my="3">
                        <Button
                            onClick={() => {
                                setState({
                                    ...state,
                                    tarif: [
                                        ...state.tarif,
                                        {
                                            meter_kubik_awal: 0,
                                            meter_kubik_akhir: null,
                                            tarif: 0,
                                        },
                                    ],
                                });
                            }}
                            colorScheme={"blue"}>
                            Tambah Tarif
                        </Button>
                    </Box>

                    {state.tarif.map((t, idx) => {
                        return (
                            <Flex my={"3"} key={idx} borderWidth="1px" borderRadius="lg">
                                <Box m={3}>
                                    <FormLabel>Kubik Awal</FormLabel>
                                    <Input
                                        name="meter_kubik_awal"
                                        type="number"
                                        value={t.meter_kubik_awal ?? ""}
                                        onChange={(e) => handleTarifChange(e, idx)}
                                        required
                                    />
                                </Box>

                                <Box m={3}>
                                    <FormLabel>Kubik Akhir</FormLabel>
                                    <Input
                                        name="meter_kubik_akhir"
                                        type="number"
                                        value={t.meter_kubik_akhir ?? ""}
                                        disabled={
                                            t.meter_kubik_akhir === null &&
                                            idx + 1 === state.tarif.length
                                        }
                                        onChange={(e) => handleTarifChange(e, idx)}
                                        required
                                    />
                                </Box>

                                <Box m={3} minW={"48"}>
                                    <FormLabel>Tarif</FormLabel>
                                    <Input
                                        name="tarif"
                                        type="text"
                                        value={t.tarif ?? ""}
                                        onChange={(e) => handleTarifChange(e, idx)}
                                        required
                                    />
                                </Box>

                                <CloseButton
                                    hidden={!(state.tarif.length > 1)}
                                    onClick={() => {
                                        const tarif = state.tarif.filter((_, i) => i !== idx);
                                        tarif.at(-1)!.meter_kubik_akhir = null;

                                        setState({
                                            ...state,
                                            tarif,
                                        });
                                    }}
                                />
                            </Flex>
                        );
                    })}

                    <Button isLoading={isLoading} type="submit" colorScheme="teal" size="md">
                        Submit
                    </Button>
                </form>
            </Container>
        </>
    );
};

export default GolonganForm;
