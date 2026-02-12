import express, { type Request, type Response } from "express";
import { handler as createTransactionHandler } from "./services/payments/lambdas/create-transaction.lambda";
import { handler as getTransactionHandler } from "./services/payments/lambdas/get-transaction.lambda";
import { handler as createOrderHandler } from "./services/orders/lambdas/create-order.lambda";
import { handler as getOrderHandler } from "./services/orders/lambdas/get-order.lambda";
import { lambda } from "./helpers/apiGw.helper";

const app = express();
app.use(express.json());

app.post("/transactions", lambda(createTransactionHandler));
app.get("/transactions/:id", lambda(getTransactionHandler));

app.post("/orders", lambda(createOrderHandler));
app.get("/orders/:id", lambda(getOrderHandler));

app.listen(3000, () => {
  console.log("Local API Gateway running on http://localhost:3000");
});
