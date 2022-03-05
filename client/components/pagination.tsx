import { Button, Center } from "@chakra-ui/react";
import type { Dispatch, FC, SetStateAction } from "react";

interface Props {
    isLoading: boolean;
    count: number;
    query: Required<{ skip: number; take: number }>;
    setQuery: Dispatch<SetStateAction<any>>;
}

const Pagination: FC<Props> = ({ isLoading, query, setQuery, count }) => {
    const { take, skip } = query;

    const nextOnClick = () => {
        setQuery({ ...query, skip: query.skip + 10 });
    };

    const backOnClick = () => {
        setQuery({ ...query, skip: query.skip - 10 });
    };

    return (
        <Center my="3">
            <Button
                onClick={backOnClick}
                disabled={skip === 0}
                isLoading={isLoading}
                mx="3"
                minW="24"
                colorScheme="teal"
                size="md">
                Back
            </Button>
            <Button
                onClick={nextOnClick}
                disabled={Number(skip) + Number(take) >= count || take == 0}
                isLoading={isLoading}
                mx="3"
                minW="24"
                colorScheme="teal"
                size="md">
                Next
            </Button>
        </Center>
    );
};
export default Pagination;
