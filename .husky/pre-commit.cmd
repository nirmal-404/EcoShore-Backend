@echo off
REM Windows pre-commit wrapper to run npm script cross-platform
node -e "require('child_process').spawnSync('npm', ['run', 'prettier'], { stdio: 'inherit' }); process.exit(0)"
