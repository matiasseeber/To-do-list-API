import app from "./src/app";
import { verifyToken } from "./src/middlewares/verifyToken"

import { default as routerAuth } from "./src/routers/routerAuth";
import { default as routerUsers } from "./src/routers/routerUsers";

app.use("/auth", verifyToken, routerAuth)

app.use("/users", verifyToken, routerUsers);

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});