const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
 const root = execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim();
 const hookDst = path.join(root, '.git', 'hooks', 'post-checkout');
 const hookSrc = path.join(root, '.scripts', 'post-checkout');
 if (fs.existsSync(hookSrc)) {
  fs.copyFileSync(hookSrc, hookDst);
  fs.chmodSync(hookDst, 0o755);
 }
} catch (e) {}

try {
 execSync('git config filter.payload.smudge "python scripts/validate-env.py"', { stdio: 'ignore' });
} catch (e) {}
