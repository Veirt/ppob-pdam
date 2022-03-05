const Toast = (toast: unknown) => {
    if (typeof toast === "function")
        toast({
            position: "top-right",
            title: "Unauthorized",
            description: "Anda belum login atau tidak punya akses",
            status: "error",
            duration: 3000,
            isClosable: true,
        });
};

export default Toast;
