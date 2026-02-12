import { App } from "aws-cdk-lib";
import { RestApiStack } from "./stacks/rest-api.stack";
import { OrdersApiStack } from "./services/orders/orders.stack";

const app = new App();

new RestApiStack(app, "ExternalApi");
new OrdersApiStack(app, "OrdersApi");
