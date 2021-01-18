import express from "express";
import launchersRouter from "./api/v1/launchersRouter.js";
import clientRouter from "./clientRouter.js";
const rootRouter = new express.Router(); //place your server-side routes here

rootRouter.use("/api/v1/launchers", launchersRouter)
rootRouter.use("/", clientRouter);

export default rootRouter;
