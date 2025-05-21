import chalk from "chalk";
import { log } from "console";

export type Job = () => Promise<void>;

class SchedulerService {
  private jobQueue: Job[] = [];
  private RETRY_TIME_SECONDS = 1;
  private static instance: SchedulerService = new SchedulerService();

  public static getInstance(): SchedulerService {
    return this.instance;
  }

  public queue(job: Job) {
    this.jobQueue.push(job);
  }

  public startWorkloop() {
    log(`${chalk.cyan("[SCHEDULER]")} Workloop started`);
    this.performWorkloop();
  }

  private async performWorkloop() {
    const job = this.jobQueue.shift();

    // Only run the queue if there's an item
    if (job) {
      log(`${chalk.cyan("[SCHEDULER]")} Job detected, perfoming work...`);
      // Run the queued job function
      await job();
      log(`${chalk.cyan("[SCHEDULER]")} Scaling completed`);
    }

    // Wait 2 seconds before trying again
    setTimeout(() => this.performWorkloop(), this.RETRY_TIME_SECONDS * 1000);
  }
}

export default SchedulerService;
