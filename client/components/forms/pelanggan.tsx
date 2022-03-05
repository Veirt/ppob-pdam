import { Box, Button, Container, FormControl, FormLabel, Input } from "@chakra-ui/react";
import useFetch from "@hooks/useFetch";
import type { Golongan } from "@types";
import toOptions from "@utils/toOptions";
import { Select } from "chakra-react-select";
import type { ChangeEvent, Dispatch, FC, FormEvent, SetStateAction } from "react";

export interface CustomerState {
    nama: string;
    alamat: string;
    golongan: Golongan;
}

interface IProps {
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: FormEvent) => void;
    state: CustomerState;
    setState: Dispatch<SetStateAction<CustomerState>>;
    isLoading: boolean;
}

const CustomerForm: FC<IProps> = ({ handleChange, handleSubmit, state, setState, isLoading }) => {
    const [golongan] = useFetch<Golongan[]>("/golongan", []);
    const golonganOptions = toOptions(golongan, "id_golongan", "nama_golongan");

    return (
        <>
            <Container>
                <form onSubmit={handleSubmit}>
                    <FormControl>
                        <Box my={3}>
                            <FormLabel htmlFor="nama">Nama</FormLabel>
                            <Input
                                id="nama"
                                name="nama"
                                type="text"
                                value={state.nama || ""}
                                onChange={handleChange}
                                required
                            />
                        </Box>

                        <Box my={3}>
                            <FormLabel htmlFor="alamat">Alamat</FormLabel>
                            <Input
                                id="alamat"
                                name="alamat"
                                type="text"
                                value={state.alamat || ""}
                                onChange={handleChange}
                                required
                            />
                        </Box>

                        <Box my={3}>
                            <FormLabel htmlFor="golongan">Golongan</FormLabel>
                            <Select
                                id="golongan"
                                instanceId="golongan-select"
                                name="golongan"
                                options={golonganOptions}
                                value={{
                                    value: state.golongan?.id_golongan || 0,
                                    label: state.golongan?.nama_golongan || "",
                                }}
                                onChange={(golongan) => {
                                    setState({
                                        ...state,
                                        golongan: {
                                            id_golongan: golongan!.value as number,
                                            nama_golongan: golongan!.label as string,
                                        },
                                    });
                                }}></Select>
                        </Box>
                    </FormControl>

                    <Button isLoading={isLoading} type="submit" colorScheme="teal" size="md">
                        Submit
                    </Button>
                </form>
            </Container>
        </>
    );
};

export default CustomerForm;
