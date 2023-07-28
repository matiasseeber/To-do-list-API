import express from "express";
import jwt from "jsonwebtoken";
import app from "../app";

export const verifyToken = express.Router();

verifyToken.use((req, res, next) => {
    let token: string = req.headers["access-token"]?.toString() || req.headers["authorization"]?.toString() || "";

    if (!token || token.length == 0) {
        return res.status(400).json({ msg: "The access-token is mandatory." })
    }

    token = token.replace("Bearer ", "");

    const secretKey = app.get("secretKey");

    jwt.verify(token, secretKey, (error: any, decoded: any) => {
        if (error) {
            console.log(error)
            return res.status(401).json({ msg: "Invalid token" });
        }
        req.decoded = decoded;
        req.token = token;
        next();
    })
})