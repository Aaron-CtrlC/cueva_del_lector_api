import { createApp } from "./app";
import { env } from "./shared/config/env";

const app = createApp();

app.listen(env.SERVER_PORT, () => {
  console.log(`Server listening on port ${env.SERVER_PORT}`);
});
