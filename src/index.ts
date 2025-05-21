import "dotenv/config";
import express from "express";
import { PORT } from "./utils/config";
import { scaleHandler } from "./handler/scaleHandler";
import SchedulerService from "./service/SchedulerService";
import errorHandler from "./handler/errorHandler";

const app = express();

app.use(express.json());

app.post("/schedule/scale", scaleHandler);

/**
 * Global error handling middleware
 * This will catch all errors and send an appropriate response to the client
 */
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}...`);

  // Start scheduler scan workloop
  SchedulerService.getInstance().startWorkloop();
});
