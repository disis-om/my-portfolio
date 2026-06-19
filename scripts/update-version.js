import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '../..');
const reactDir = path.resolve(__dirname, '..');

// Get git binary path since it might not be in PATH
const gitPath = 'C:\\Program Files\\Git\\cmd\\git.exe';

function runGit(args) {
  try {
    return execSync(`"${gitPath}" ${args}`, { cwd: rootDir }).toString().trim();
  } catch (e) {
    console.warn(`Git command failed: ${args}`, e.message);
    return null;
  }
}

// 1. Fetch details from Git
const commitCount = runGit('rev-list --count HEAD') || '1';
const commitHash = runGit('rev-parse --short HEAD') || 'unknown';

// 2. Read package.json version
const packageJsonPath = path.join(reactDir, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const appVersion = packageJson.version || '1.3.0';

// 3. Generate dynamic version string
const buildVersion = `${appVersion}-beta.${commitCount}`;

// 4. Update main-react/public/version.json
const publicVersionPath = path.join(reactDir, 'public/version.json');
let versionJson = {};
if (fs.existsSync(publicVersionPath)) {
  try {
    versionJson = JSON.parse(fs.readFileSync(publicVersionPath, 'utf8'));
  } catch (e) {
    versionJson = {};
  }
}

versionJson['build-id'] = appVersion;
if (!versionJson.meta) versionJson.meta = {};
versionJson.meta['build-version'] = buildVersion;

// Update first module or compilation signature
if (versionJson.modules && versionJson.modules[1] && versionJson.modules[1].compilation) {
  versionJson.modules[1].compilation.timestamp = new Date().toISOString();
  versionJson.modules[1].compilation.buildSignature = `sha256-git-${commitHash}-${Math.random().toString(36).substring(2, 10)}`;
}

fs.writeFileSync(publicVersionPath, JSON.stringify(versionJson, null, 2), 'utf8');
console.log(`[VERSION ENGINE] Updated public/version.json to ${buildVersion} (commit count: ${commitCount}, hash: ${commitHash})`);

// 5. Update system-version.json copies
const systemVersion = {
  appName: packageJson.name || "om-dev-portfolio-react",
  appVersion: appVersion,
  appBuildVersion: buildVersion,
  environment: {
    nodeVersion: process.version,
    npmVersion: "11.13.0",
    vsCodeVersion: "1.120.0",
    osArchitecture: "Windows x64"
  },
  git: {
    commitHash: commitHash,
    commitCount: parseInt(commitCount, 10)
  },
  lastUpdated: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
};

const systemVersionStr = JSON.stringify(systemVersion, null, 2);

fs.writeFileSync(path.join(reactDir, 'system-version.json'), systemVersionStr, 'utf8');
fs.writeFileSync(path.join(rootDir, 'system-version.json'), systemVersionStr, 'utf8');
console.log('[VERSION ENGINE] Synchronized system-version.json files successfully.');
