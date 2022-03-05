import { useToast } from "@chakra-ui/react";
import api, { isAxiosError } from "@utils/api";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

function useFetch<T>(url: string, defaultState: T): [T, Dispatch<SetStateAction<T>>] {
    const [state, setState] = useState<T>(defaultState);

    const router = useRouter();
    const toast = useToast();

    useEffect(() => {
        if (!router.isReady) return;

        const fetchApi = async () => {
            try {
                const res = await api.get(url);

                if (res.data.result) {
                    setState(res.data.result);
                } else {
                    setState(res.data);
                }
            } catch (err) {
                if (isAxiosError(err)) {
                    console.error(`Something went wrong when fetching ${url}: ${err}`);
                    switch (err.response!.status) {
                        case 404:
                            toast({
                                position: "top-right",
                                title: "Error",
                                description: "Tidak ditemukan",
                                status: "error",
                                duration: 3000,
                                isClosable: true,
                            });
                            break;
                    }
                } else {
                    console.error(`Unexpected error when using useFetch hook: ${err}`);
                }
            }
        };

        fetchApi();
    }, [url]);

    return [state, setState];
}

export default useFetch;
