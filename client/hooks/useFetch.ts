import { Dispatch, SetStateAction, useEffect, useState } from "react";
import api, { isAxiosError } from "../utils/api";

function useFetch<T>(
    url: string,
    defaultState: T
): [T, Dispatch<SetStateAction<T>>] {
    const [state, setState] = useState<T>(defaultState);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await api.get(url, { withCredentials: true });

                setState(res.data);
            } catch (err) {
                if (isAxiosError(err)) {
                    console.error(
                        `Something went wrong when fetching ${url}: ${err}`
                    );
                } else {
                    console.error(
                        `Unexpected error when using useFetch hook: ${err}`
                    );
                }
            }
        };

        fetchApi();
    }, [url]);

    return [state, setState];
}

export default useFetch;
