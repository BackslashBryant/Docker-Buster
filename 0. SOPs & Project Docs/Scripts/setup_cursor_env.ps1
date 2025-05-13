#!/bin/bash

# --- Basic setup ---

echo "🔧 Creating recommended folders and cleaning structure..."

# Create basic folders if they don't exist
mkdir -p .cursor
mkdir -p memory_bank
mkdir -p backend
mkdir -p frontend

# --- Cursor .cursor/ files ---

echo "📂 Setting up .cursor files..."

# Create minimal mcp.json
cat > .cursor/mcp.json <<EOL
{
  "projectName": "New Project",
  "description": "Describe your project here.",
  "memoryBankPath": "./memory_bank/",
  "backend": {
    "path": "backend/",
    "buildCommand": "npm run build",
    "startCommand": "npm run dev",
    "testCommand": "npm run test"
  },
  "frontend": {
    "path": "frontend/",
    "buildCommand": "npm run build",
    "startCommand": "npm run dev",
    "testCommand": "npm run test"
  },
  "devDependencies": ["Node.js", "React", "Next.js"],
  "taskAutomation": true,
  "debugConfigAvailable": true
}
EOL

# Create basic tasks.json
cat > .cursor/tasks.json <<EOL
[
  {
    "label": "Start Backend",
    "type": "shell",
    "command": "cd backend && npm run dev"
  },
  {
    "label": "Start Frontend",
    "type": "shell",
    "command": "cd frontend && npm run dev"
  },
  {
    "label": "Clean Project",
    "type": "shell",
    "command": "rm -rf node_modules dist build .next .turbo"
  }
]
EOL

# Create basic debug.json
cat > .cursor/debug.json <<EOL
[
  {
    "name": "Debug Backend",
    "type": "node",
    "request": "launch",
    "program": "\${workspaceFolder}/backend/index.js",
    "cwd": "\${workspaceFolder}/backend"
  },
  {
    "name": "Debug Frontend",
    "type": "chrome",
    "request": "launch",
    "url": "http://localhost:3000",
    "webRoot": "\${workspaceFolder}/frontend"
  }
]
EOL

# --- Git and Ignore Setup ---

echo "📑 Setting up .gitignore..."

cat > .gitignore <<EOL
# Node
node_modules/
dist/
build/
.next/
.turbo/
.cache/
coverage/

# Editor junk
.vscode/
.cursor/
*.log

# Environment
.env
.env.local
.env.production
.env.development

# OS junk
.DS_Store
Thumbs.db
EOL

# --- Prettier + ESLint ---

echo "🎨 Installing Prettier and ESLint..."

npm install --save-dev prettier eslint

echo "📜 Creating basic Prettier and ESLint config files..."

# Prettier config
cat > .prettierrc <<EOL
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "trailingComma": "es5"
}
EOL

# ESLint config
cat > .eslintrc.json <<EOL
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {}
}
EOL

# --- Memory Bank setup ---

echo "🧠 Creating basic Memory Bank structure..."

touch memory_bank/projectbrief.md
touch memory_bank/techContext.md
touch memory_bank/systemPatterns.md
touch memory_bank/activeContext.md
touch memory_bank/progress.md

# --- Final Summary ---

echo ""
echo "✅ Cursor Dev Environment Setup Complete!"
echo "✅ Created: .cursor/, memory_bank/, backend/, frontend/"
echo "✅ Installed: Prettier + ESLint"
echo "✅ Configured: mcp.json, tasks.json, debug.json, .gitignore"
echo "🚀 Ready to develop!"
