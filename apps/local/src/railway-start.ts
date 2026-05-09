import { startServer } from "./serve";

const port = Number.parseInt(process.env.PORT ?? "4788", 10);
const authToken = process.env.EXECUTOR_AUTH_TOKEN?.trim() || null;
const authPassword = process.env.EXECUTOR_AUTH_PASSWORD?.trim() || null;
const dataDir =
  process.env.EXECUTOR_DATA_DIR?.trim() ||
  (process.env.RAILWAY_VOLUME_MOUNT_PATH
    ? `${process.env.RAILWAY_VOLUME_MOUNT_PATH}/executor`
    : "/tmp/executor");

process.env.EXECUTOR_DATA_DIR = dataDir;
process.env.EXECUTOR_SCOPE_DIR = process.env.EXECUTOR_SCOPE_DIR?.trim() || dataDir;

if (!authToken && !authPassword) {
  throw new Error(
    "Set EXECUTOR_AUTH_TOKEN or EXECUTOR_AUTH_PASSWORD before deploying Executor on Railway.",
  );
}

const allowedHosts = [
  process.env.RAILWAY_PUBLIC_DOMAIN,
  process.env.RAILWAY_PRIVATE_DOMAIN,
  ...(process.env.EXECUTOR_ALLOWED_HOSTS ?? "").split(","),
]
  .map((host) => host?.trim())
  .filter((host): host is string => Boolean(host));

const server = await startServer({
  port,
  hostname: "0.0.0.0",
  allowedHosts,
  authToken: authToken ?? undefined,
  authPassword: authPassword ?? undefined,
});

console.log(`Executor listening on 0.0.0.0:${server.port}`);
