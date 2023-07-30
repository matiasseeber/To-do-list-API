import app from "./src/app";

import { default as routerUsers } from "./src/routers/routerUsers";
import { default as authRouter } from "./src/auth/routers/authRouter";
import { default as todosRouter } from "./src/routers/routersTodos";

import { verifyToken } from "./src/middlewares/verifyToken"

app.use("/auth", authRouter);

app.use("/users", verifyToken, routerUsers);

app.use("/todos", verifyToken, todosRouter);

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});