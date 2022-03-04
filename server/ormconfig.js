module.exports = {
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USER || "veirt",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME,
    synchronize: process.env.DB_SYNCHRONIZE || false,
    logging: false,
    entities: ["src/entities/*.ts", "entities/*.js"],
};
