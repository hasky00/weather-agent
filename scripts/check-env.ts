/**
 * Validates that required environment variables are set before running the app.
 * Run with: npx tsx scripts/check-env.ts
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const envPath = resolve(import.meta.dirname, '..', '.env');

if (!existsSync(envPath)) {
  console.error('ERROR: .env file not found. Copy .env.example to .env and fill in your API keys.');
  console.error('  cp .env.example .env');
  process.exit(1);
}

const envContent = readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const [key, ...rest] = trimmed.split('=');
  envVars[key.trim()] = rest.join('=').trim();
}

const model = envVars['MODEL'] || 'openai/gpt-4o-mini';
const provider = model.split('/')[0];

const providerKeyMap: Record<string, string> = {
  openai: 'OPENAI_API_KEY',
  anthropic: 'ANTHROPIC_API_KEY',
  google: 'GOOGLE_GENERATIVE_AI_API_KEY',
  groq: 'GROQ_API_KEY',
  cerebras: 'CEREBRAS_API_KEY',
  mistral: 'MISTRAL_API_KEY',
};

const requiredKey = providerKeyMap[provider];
if (!requiredKey) {
  console.warn(`WARNING: Unknown provider "${provider}" in MODEL="${model}". Cannot validate API key.`);
} else if (!envVars[requiredKey]) {
  console.error(`ERROR: MODEL is set to "${model}" but ${requiredKey} is empty.`);
  console.error(`  Set ${requiredKey} in your .env file.`);
  process.exit(1);
} else {
  console.log(`Environment OK: MODEL="${model}", ${requiredKey} is set.`);
}
