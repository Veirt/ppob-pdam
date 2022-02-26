import axios, { AxiosError } from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
    withCredentials: true,
});

export const isAxiosError = (err: unknown): err is AxiosError => {
    return axios.isAxiosError(err);
};

export default instance;
