require("dotenv").config();

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

const config = {
    JWT_SECRET: process.env.JWT_SECRET
};

module.exports = config;
