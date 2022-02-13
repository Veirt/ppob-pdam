import { Box, Container, Flex } from "@chakra-ui/react";
import { FC } from "react";

const DashboardItem: FC = ({ children }) => {
    return (
        <Box
            display={"flex"}
            my={"3"}
            justifyContent="center"
            alignItems="center"
            maxW="sm"
            minW={"sm"}
            borderWidth="1px"
            borderRadius="lg">
            {children}
        </Box>
    );
};

const Dashboard: FC = () => {
    return (
        <>
            <Container maxW="container.xl" my={"5"}>
                <Flex wrap={"wrap"} justifyContent={"space-evenly"} minHeight={"32"}>
                    <DashboardItem>Test</DashboardItem>
                    <DashboardItem>Test</DashboardItem>
                    <DashboardItem>Test</DashboardItem>
                </Flex>
            </Container>
        </>
    );
};

export default Dashboard;
