import { App } from "aws-cdk-lib";
import { RestApiStack } from "./stacks/rest-api.stack";
import { OrdersApiStack } from "./services/orders/orders.stack";

const app = new App();
const env = app.node.tryGetContext('env') as string | undefined;
const envSuffix = app.node.tryGetContext('envSuffix') ?? '';

// PR envs use envSuffix (e.g., -pr-42)
// Pre-prod uses -preprod
// Prod and local dev have no suffix
const stackSuffix = envSuffix
  ? `-${envSuffix}`
  : env === 'preprod'
    ? '-preprod'
    : '';

new RestApiStack(app, `ExternalApi${stackSuffix}`);
new OrdersApiStack(app, `OrdersApi${stackSuffix}`);
