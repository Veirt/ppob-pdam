import { Box, Button, Container, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { ChangeEvent, Dispatch, FC, FormEvent, SetStateAction, useState } from "react";
import { Role } from "../../@types";
import useFetch from "../../hooks/useFetch";
import toOptions from "../../utils/toOptions";

export interface EmployeeState {
    nama: string;
    username: string;
    password: string;
    role: Role;
}

interface Props {
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: FormEvent) => void;
    state: EmployeeState;
    setState: Dispatch<SetStateAction<EmployeeState>>;
    isLoading: boolean;
}

const PetugasForm: FC<Props> = ({ handleChange, handleSubmit, state, setState, isLoading }) => {
    const [roles] = useFetch<Role[]>("/petugas/role", []);
    const roleOptions = toOptions(roles, "id_role", "nama_role");
    console.log(roles);

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
                            <FormLabel htmlFor="role">Role</FormLabel>
                            <Select
                                id="role"
                                instanceId="role-select"
                                name="role"
                                options={roleOptions}
                                value={{
                                    value: state.role?.id_role || 0,
                                    label: state.role?.nama_role || "",
                                }}
                                onChange={(role) => {
                                    const selectedRole = roles.find(
                                        (r) => r.id_role === (role!.value as number)
                                    );

                                    setState({
                                        ...state,
                                        role: {
                                            id_role: role!.value as number,
                                            nama_role: role!.label as string,
                                            login: selectedRole?.login,
                                        },
                                    });

                                    // if (selectedRole?.login) {
                                    //     // show username password
                                    //     setState({
                                    //         ...state,
                                    //         role: { ...state.role, login: true },
                                    //     });
                                    // } else {
                                    //     setState({
                                    //         ...state,
                                    //         role: { ...state.role, login: false },
                                    //     });
                                    // }
                                }}
                            />
                        </Box>

                        {state.role.login && (
                            <>
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
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={state.password || ""}
                                        onChange={handleChange}
                                    />
                                </Box>
                            </>
                        )}
                    </FormControl>

                    <Button isLoading={isLoading} type="submit" colorScheme="teal" size="md">
                        Submit
                    </Button>
                </form>
            </Container>
        </>
    );
};

export default PetugasForm;
