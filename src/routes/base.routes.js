import { Router } from "express";
const baseRouter = Router();
baseRouter.get("/", (req, res) => {
	return res.status(200).send("Server is running....");
});

baseRouter.post("/", (req, res) => {
	return res.status(200).send("Server is running....");
});

baseRouter.patch("/", (req, res) => {
	return res.status(200).send("Server is running....");
});

baseRouter.put("/", (req, res) => {
	return res.status(200).send("Server is running....");
});

baseRouter.delete("/", (req, res) => {
	return res.status(200).send("Server is running....");
});

export default baseRouter;