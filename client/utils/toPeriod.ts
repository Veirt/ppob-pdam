export default (date: Date) => {
    return new Date(date).toLocaleString("id-ID", {
        month: "long",
        year: "numeric",
    });
};
