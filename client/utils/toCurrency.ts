export default (num?: number | null) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "idr",
    }).format(num || 0);
};
