const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const outputPath = path.join(projectRoot, "config.local.js");

const ENV_KEYS = {
  supabaseUrl: "ANDRONICUS_SUPABASE_URL",
  supabaseAnonKey: "ANDRONICUS_SUPABASE_ANON_KEY",
  adminApiSecret: "ANDRONICUS_ADMIN_API_SECRET",
};

function pickEnvConfig() {
  const supabaseUrl = (process.env[ENV_KEYS.supabaseUrl] || "").trim();
  const supabaseAnonKey = (process.env[ENV_KEYS.supabaseAnonKey] || "").trim();
  const adminApiSecret = (process.env[ENV_KEYS.adminApiSecret] || "").trim();

  const missing = [];
  if (!supabaseUrl) missing.push(ENV_KEYS.supabaseUrl);
  if (!supabaseAnonKey) missing.push(ENV_KEYS.supabaseAnonKey);
  if (!adminApiSecret) missing.push(ENV_KEYS.adminApiSecret);

  return { supabaseUrl, supabaseAnonKey, adminApiSecret, missing };
}

function renderConfig(config) {
  return (
    "window.ANDRONICUS_CONFIG = {\n" +
    `  enabled: ${config.enabled ? "true" : "false"},\n` +
    `  supabaseUrl: ${JSON.stringify(config.supabaseUrl)},\n` +
    `  supabaseAnonKey: ${JSON.stringify(config.supabaseAnonKey)},\n` +
    `  adminApiSecret: ${JSON.stringify(config.adminApiSecret)}\n` +
    "};\n"
  );
}

function writeConfigFile(config) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, renderConfig(config), "utf8");
}

const envConfig = pickEnvConfig();
if (envConfig.missing.length === 0) {
  writeConfigFile({ ...envConfig, enabled: true });
  console.log("Generated config.local.js from environment variables.");
  process.exit(0);
}

const existingLocalConfig = fs.existsSync(outputPath);
if (existingLocalConfig && !process.env.VERCEL) {
  console.log("No deploy env vars found. Keeping existing local config.local.js.");
  process.exit(0);
}

console.error("Missing required environment variables for deployment:");
envConfig.missing.forEach((key) => console.error(`- ${key}`));
console.error("Set these in Vercel Project Settings → Environment Variables.");
process.exit(1);
