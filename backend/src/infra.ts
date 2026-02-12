import { App } from "aws-cdk-lib";
import { RestApiStack } from "./stacks/rest-api.stack";
import { OrdersApiStack } from "./services/orders/orders.stack";

const app = new App();
const suffix = app.node.tryGetContext('envSuffix') ?? '';
const stackSuffix = suffix ? `-${suffix}` : '';

new RestApiStack(app, `ExternalApi${stackSuffix}`);
new OrdersApiStack(app, `OrdersApi${stackSuffix}`);
