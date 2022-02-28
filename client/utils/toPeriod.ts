export default (date?: Date) => {
    if (date) {
        return new Date(date).toLocaleString("id-ID", {
            month: "long",
            year: "numeric",
        });
    }
    return "Invalid Date";
};
