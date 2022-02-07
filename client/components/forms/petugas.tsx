import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Input,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { ChangeEvent, Dispatch, FC, FormEvent, SetStateAction } from "react";
import { Role } from "../../@types";
import useFetch from "../../hooks/useFetch";
import toOptions from "../../utils/toOptions";

export interface IEmployeeState {
    nama: string;
    username: string;
    password: string;
    role: Role;
}

interface IProps {
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: FormEvent) => void;
    state: IEmployeeState;
    setState: Dispatch<SetStateAction<IEmployeeState>>;
    isLoading: boolean;
}

const PetugasForm: FC<IProps> = ({
    handleChange,
    handleSubmit,
    state,
    setState,
    isLoading,
}) => {
    const [golongan] = useFetch<Role[]>("/petugas/role", []);
    const golonganOptions = toOptions(golongan, "id_role", "nama_role");

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
                            <FormLabel htmlFor="username">Username</FormLabel>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                value={state.username || ""}
                                onChange={handleChange}
                                required
                            />
                        </Box>

                        <Box my={3}>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <Input
                                placeholder="Masukkan hanya ketika ingin mengganti"
                                id="password"
                                name="password"
                                type="password"
                                value={state.password || ""}
                                onChange={handleChange}
                            />
                        </Box>

                        <Box my={3}>
                            <FormLabel htmlFor="role">Role</FormLabel>
                            <Select
                                id="role"
                                instanceId="role-select"
                                name="role"
                                options={golonganOptions}
                                value={{
                                    value: state.role?.id_role || 0,
                                    label: state.role?.nama_role || "",
                                }}
                                onChange={(role) => {
                                    setState({
                                        ...state,
                                        role: {
                                            id_role: role!.value as number,
                                            nama_role: role!.label as string,
                                        },
                                    });
                                }}
                            ></Select>
                        </Box>
                    </FormControl>

                    <Button
                        isLoading={isLoading}
                        type="submit"
                        colorScheme="teal"
                        size="md"
                    >
                        Submit
                    </Button>
                </form>
            </Container>
        </>
    );
};

export default PetugasForm;
