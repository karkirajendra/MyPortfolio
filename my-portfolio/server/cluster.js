import cluster from "node:cluster";
import os from "node:os";
import { config } from "./config.js";

const workers = config.workers || os.cpus().length || 1;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} starting ${workers} workers`);
  for (let i = 0; i < workers; i += 1) cluster.fork();
  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} exited; starting a replacement`);
    cluster.fork();
  });
} else {
  await import("./index.js");
}
