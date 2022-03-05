type ErrorType = "unauthorized" | "any";

export const Toast = (toast: unknown, type: ErrorType, description?: string) => {
    const options = {
        position: "top-right",
        status: "error",
        duration: 3000,
        isClosable: true,
    };

    if (typeof toast !== "function") return;

    switch (type) {
        case "unauthorized":
            toast({
                ...options,
                title: "Unauthorized",
                description: "Anda belum login atau tidak punya akses",
            });
            break;

        case "any":
            toast({
                ...options,
                title: "Error",
                description,
            });
            break;
    }
};

export default Toast;
