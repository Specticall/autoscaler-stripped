import express from "express";
import "dotenv";

const PORT = process.env.PORT || "8000";
const RETRY_TIME_SECONDS = Number(process.env.RETRY_TIME_SECONDS) || 1;
const SILENT = Boolean(process.env.SILENT) || false;
const app = express();
app.use(express.json());

// Isinya data2 config tetang VM yang mau di spawn
type ScaleJob = {};

/**
 * POST /schedulescale
 * URL yang bakal di hit sama alert manager buat schedule "scale job"
 * sum(rate(container_cpu_usage_seconds_total{job="kubelet", image!="", container!="POD"}[5m]))/sum(machine_cpu_cores) > 0.8
 */
const queue: ScaleJob[] = [];
app.post("/schedule/scale", async (req, res) => {
  try {
    // Handle scale request
    // Nanti ini objectnya isi config buat VM yang mau dibuat
    const scaleJob: ScaleJob = {};

    // Requestnya di push ke queue, biar dia nga blocking selanjutnya
    queue.push(scaleJob);
    res.send({
      status: "success",
      message: "Successfuly queued scale job",
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: (err as Error).message,
    });
  }
});

/**
 * Dia loop indefinitely buat ngecheck ada job yang bisa dijalanin atoga
 */
async function jobScheduler() {
  const job = queue.shift();

  // Only run the queue if there's an item
  if (job) {
    log("[SCHEDULER] Job detected, started scaling...");
    // Run ansible playbook to scale VM
    // Contoh mocking pake timer (10s wait), nanti ganti pake code spawn child process (execa) buat run ansible <<<
    await new Promise((res) => setTimeout(res, 10000));

    log("[SCHEDULER] Scaling completed");
  }

  // Timer 2 second buat call functionnya lagi
  setTimeout(jobScheduler, RETRY_TIME_SECONDS * 1000);
}

/**
 * Logging function yang bakal stop kalo di config
 */
function log(...args: unknown[]) {
  if (SILENT) return;
  console.log(...args);
}

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}...`);
  jobScheduler();
});
