# Git Push Quick Fix Guide

If you're having trouble pushing to GitHub, here are the fastest solutions.

## Current Status

Your repository is configured with:
- Remote: `git@github.com:WarmUp-AI/BA12AUtoDev.git` (SSH)
- Branch: `main`

---

## Quick Fix #1: Use GitHub Personal Access Token (Easiest)

If SSH isn't working, switch to HTTPS with a personal access token:

### Step 1: Generate Token

1. Go to GitHub: https://github.com/settings/tokens
2. Click **"Generate new token"** > **"Generate new token (classic)"**
3. Give it a name: `BA12 Deployment`
4. Select scopes: Check **`repo`** (full control of private repositories)
5. Click **"Generate token"**
6. **COPY THE TOKEN** (you won't see it again!)

### Step 2: Update Git Remote

```bash
cd /Users/rory/BA12/modernized

# Change from SSH to HTTPS
git remote set-url origin https://github.com/WarmUp-AI/BA12AUtoDev.git

# Verify
git remote -v
```

### Step 3: Push with Token

```bash
git push origin main
```

When prompted for username/password:
- **Username**: Your GitHub username
- **Password**: Paste the token you copied (NOT your GitHub password)

---

## Quick Fix #2: Fix SSH (If you prefer SSH)

### Step 1: Check if SSH Key Exists

```bash
ls -la ~/.ssh/id_*.pub
```

If you see a file like `id_rsa.pub` or `id_ed25519.pub`, you have a key. Skip to Step 3.

### Step 2: Generate SSH Key (if needed)

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Press Enter to accept default location, and optionally set a passphrase.

### Step 3: Copy SSH Public Key

```bash
cat ~/.ssh/id_ed25519.pub
```

Or if you have RSA:
```bash
cat ~/.ssh/id_rsa.pub
```

Copy the entire output (starts with `ssh-ed25519` or `ssh-rsa`).

### Step 4: Add to GitHub

1. Go to GitHub: https://github.com/settings/keys
2. Click **"New SSH key"**
3. Title: `Mac - BA12`
4. Paste the key
5. Click **"Add SSH key"**

### Step 5: Test and Push

```bash
# Test connection
ssh -T git@github.com

# Should see: "Hi [username]! You've successfully authenticated..."

# Push
git push origin main
```

---

## Quick Fix #3: Cache Credentials (HTTPS only)

If you're using HTTPS and don't want to enter token every time:

```bash
# Store credentials permanently
git config --global credential.helper store

# Now push (you'll enter token once)
git push origin main
```

**Warning**: This stores credentials in plain text. Use with caution.

---

## Troubleshooting

### Error: "Permission denied (publickey)"

- You're using SSH but key isn't added to GitHub
- Use Quick Fix #2 or switch to HTTPS (Quick Fix #1)

### Error: "Authentication failed"

- You're using HTTPS with wrong credentials
- Make sure you're using a **Personal Access Token**, not your password
- Regenerate token if needed

### Error: "Could not resolve hostname"

- Check internet connection
- Verify remote URL: `git remote -v`

### Nothing to Push

```bash
# Check status
git status

# If "nothing to commit, working tree clean":
# Your code is already pushed! Check GitHub.

# If you have changes:
git add .
git commit -m "Update for Vercel deployment"
git push origin main
```

---

## One-Line Command to Check Everything

```bash
cd /Users/rory/BA12/modernized && git remote -v && git status && git branch
```

This shows:
- Current remote URL
- Working tree status
- Current branch

---

## Current Workaround You're Using

If your current method works, you can keep using it! But the methods above will make it faster and more standard.

---

## After Git is Working

Once you can push successfully, follow `VERCEL_SETUP.md` to deploy to Vercel.
