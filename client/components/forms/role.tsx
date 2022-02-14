import { Box, Button, Container, FormLabel, Input } from "@chakra-ui/react";
import { ChangeEvent, Dispatch, FC, FormEvent, SetStateAction } from "react";

export interface RoleState {
    nama_role: string;
}

interface Props {
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: FormEvent) => void;
    state: RoleState;
    setState: Dispatch<SetStateAction<RoleState>>;
    isLoading: boolean;
}

const RoleForm: FC<Props> = ({ handleChange, handleSubmit, state, isLoading }) => {
    return (
        <>
            <Container>
                <form onSubmit={handleSubmit}>
                    <Box my={3}>
                        <FormLabel htmlFor="nama_role">Nama Role</FormLabel>
                        <Input
                            id="nama_role"
                            name="nama_role"
                            type="text"
                            value={state.nama_role || ""}
                            onChange={handleChange}
                            required
                        />
                    </Box>

                    <Button isLoading={isLoading} type="submit" colorScheme="teal" size="md">
                        Submit
                    </Button>
                </form>
            </Container>
        </>
    );
};

export default RoleForm;
