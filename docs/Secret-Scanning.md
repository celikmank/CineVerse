# Secret Scanning Guide

This guide explains how CineVerse uses automated secret scanning to detect and prevent committed secrets in the repository.

## Overview

CineVerse uses [Gitleaks](https://github.com/gitleaks/gitleaks) to automatically scan for secrets such as:
- API keys (TMDB, AWS, Azure, etc.)
- Database connection strings with credentials
- JWT signing keys
- Private keys and certificates
- OAuth tokens and client secrets
- Password literals in code

## Automated CI Scanning

### How It Works

The secret scanning workflow (`.github/workflows/secret-scan.yml`) runs automatically:

1. **On Pull Requests**: Scans code changes in PRs before merge
2. **On Push to Master**: Validates code merged to the main branch
3. **Weekly Schedule**: Runs every Sunday to catch any missed secrets
4. **Manual Runs**: Can be triggered via GitHub Actions UI

### What Gets Scanned

- **Default Mode**: Scans current HEAD only (faster)
- **Full History Mode**: Scans entire git history (slower, more thorough)

### CI Results

- **SARIF Upload**: Results appear in the repository's **Security** tab under "Code scanning alerts"
- **PR Checks**: PRs will show a failing check if secrets are detected
- **Artifacts**: Full reports are saved as workflow artifacts for 30 days

## Running Gitleaks Locally

### Installation

**Linux/macOS:**
```bash
# Download latest release
wget https://github.com/gitleaks/gitleaks/releases/latest/download/gitleaks_8.21.2_linux_x64.tar.gz
tar -xzf gitleaks_8.21.2_linux_x64.tar.gz
sudo mv gitleaks /usr/local/bin/

# Or use Homebrew (macOS)
brew install gitleaks
```

**Windows:**
```powershell
# Download from https://github.com/gitleaks/gitleaks/releases
# Or use Scoop
scoop install gitleaks
```

### Basic Usage

```bash
# Scan current state of repository
gitleaks detect -v

# Scan with custom config
gitleaks detect --config=.gitleaks.toml -v

# Scan full git history
gitleaks detect --log-opts="--all" -v

# Generate SARIF report
gitleaks detect --report-format=sarif --report-path=gitleaks.sarif
```

### Pre-commit Hook (Optional)

Add Gitleaks as a pre-commit hook to catch secrets before committing:

```bash
# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
gitleaks protect --staged -v
EOF

chmod +x .git/hooks/pre-commit
```

## Forcing Full History Scan

### Via workflow_dispatch

1. Go to **Actions** tab in GitHub
2. Select **Secret Scanning with Gitleaks** workflow
3. Click **Run workflow**
4. Check the **"Scan full git history"** option
5. Click **Run workflow**

### Via Environment Variable

Edit the workflow file to set `FULL_HISTORY: 'true'` in the env section:

```yaml
env:
  FULL_HISTORY: 'true'  # Change from 'false' to 'true'
```

⚠️ **Note**: Full history scans take significantly longer and consume more CI resources.

## What To Do When Secrets Are Detected

### Immediate Actions

1. **DO NOT IGNORE THE ALERT** - Assume the secret is compromised
2. **Verify the Finding**: Check if it's a real secret or false positive
3. **Revoke/Rotate the Secret**:
   - **TMDB API Key**: Generate new key at https://www.themoviedb.org/settings/api
   - **JWT Key**: Generate new secure key (minimum 32 characters)
   - **Database Credentials**: Change password in database and update connection string
   - **Cloud Secrets**: Rotate in AWS Secrets Manager, Azure Key Vault, etc.

4. **Remove from Code**:
   - Replace with proper configuration (User Secrets, environment variables)
   - Follow the patterns in [SECRETS-CONFIGURATION.md](../SECRETS-CONFIGURATION.md)
   - Commit the fix

5. **Push the Fix**:
   ```bash
   git add .
   git commit -m "fix: Remove hardcoded secret and use proper configuration"
   git push
   ```

### Cleaning Git History (Optional)

⚠️ **Warning**: This rewrites git history and can cause issues for collaborators.

If the secret is in git history and you want to purge it completely:

#### Option 1: Using BFG Repo-Cleaner (Recommended)
```bash
# Download BFG from https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --replace-text secrets.txt

# Where secrets.txt contains:
# YOUR_SECRET_KEY_HERE
# another-secret-here
```

#### Option 2: Using git-filter-repo
```bash
# Install git-filter-repo
pip install git-filter-repo

# Remove a specific file from history
git filter-repo --path path/to/secret-file.json --invert-paths

# Replace text in history
git filter-repo --replace-text secrets.txt
```

After rewriting history:
```bash
git push --force-with-lease origin master
```

⚠️ **Coordinate with team**: All team members must re-clone after force push.

### False Positives

If Gitleaks flags a false positive:

1. Verify it's genuinely not a secret
2. Add it to the allowlist in `.gitleaks.toml`:

```toml
[allowlist]
description = "Known false positives"

regexes = [
  '''your-regex-here''',
]

paths = [
  '''path/to/file\.ext$''',
]

stopwords = [
  "example-safe-value",
]
```

3. Test locally: `gitleaks detect --config=.gitleaks.toml -v`
4. Commit the updated config

## GitHub Advanced Security (Optional)

For additional protection, enable GitHub Advanced Security features:

### Secret Scanning

1. Go to **Settings** → **Code security and analysis**
2. Enable **Secret scanning**
3. GitHub will automatically scan for known secret patterns
4. Alerts appear in **Security** → **Secret scanning**

**Benefits**:
- Detects secrets in real-time
- Partner patterns (AWS, Azure, GitHub tokens, etc.)
- Historical scanning of all commits
- Alert notifications

### Push Protection

1. In the same settings, enable **Push protection**
2. Blocks pushes that contain detected secrets
3. Requires GitHub Advanced Security license (free for public repos)

**Benefits**:
- Prevents secrets from ever entering the repository
- Immediate feedback to developers
- Reduces remediation work

### Enabling GitHub Advanced Security

**For Public Repositories**: Free, automatically available

**For Private Repositories**:
- Requires GitHub Advanced Security license
- Contact your GitHub administrator
- See: https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security

## Configuration

### Gitleaks Config (.gitleaks.toml)

The configuration uses:
- **Default Rules**: Gitleaks' built-in secret patterns
- **Redaction**: Secrets are partially masked in output
- **Commented Allowlist Examples**: Ready to customize for your needs

### Workflow Config (.github/workflows/secret-scan.yml)

Key configuration options:
- `FULL_HISTORY`: Set to `'true'` to scan all commits (default: `'false'`)
- `GITLEAKS_CONFIG`: Path to config file (default: `'.gitleaks.toml'`)
- Schedule: Runs weekly (Sundays at 00:00 UTC)

## Best Practices

1. ✅ **Run locally before pushing**: Use pre-commit hooks
2. ✅ **Rotate secrets immediately**: Treat detection as a breach
3. ✅ **Use proper secret management**: Follow [SECRETS-CONFIGURATION.md](../SECRETS-CONFIGURATION.md)
4. ✅ **Review alerts promptly**: Don't let secrets linger
5. ✅ **Train team members**: Everyone should understand secret hygiene
6. ❌ **Don't commit secrets**: Even to test branches
7. ❌ **Don't ignore alerts**: Investigate every finding
8. ❌ **Don't share secrets**: Use GitHub Secrets for CI/CD

## Tuning and Maintenance

### Reducing False Positives

1. Analyze the pattern that triggered the alert
2. Verify it's not a real secret
3. Add to allowlist with clear documentation
4. Test before committing

### Updating Gitleaks

The workflow automatically downloads the latest stable version (8.21.2 as of writing). To update:

1. Check latest release: https://github.com/gitleaks/gitleaks/releases
2. Update `GITLEAKS_VERSION` in workflow file
3. Test with manual workflow run

### Custom Rules

To add project-specific secret patterns:

```toml
[[rules]]
id = "custom-api-key"
description = "CineVerse Custom API Key"
regex = '''(?i)(cineverse_api_key)\s*[:=]\s*['"]?([a-zA-Z0-9]{32,})['"]?'''
tags = ["key", "API", "CineVerse"]
```

## Troubleshooting

### Workflow Fails with No Secrets

Check:
- SARIF file was generated (`gitleaks.sarif` in artifacts)
- Permissions are correct (security-events: write)
- GitHub Advanced Security is enabled for private repos

### False Positives Not Ignored

1. Verify `.gitleaks.toml` syntax
2. Test regex locally with `gitleaks detect -v`
3. Check file paths are correct (use forward slashes)
4. Ensure config file is in repository root

### Full History Scan Takes Too Long

- Full history scans are resource-intensive
- Consider scanning incrementally (chunks of history)
- Use only when necessary (suspected historical leak)
- Consider using git shallow clones in development

## Additional Resources

- [Gitleaks Documentation](https://github.com/gitleaks/gitleaks)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [OWASP Secrets Management](https://owasp.org/www-community/vulnerabilities/Use_of_hard-coded_password)
- [CineVerse Secrets Configuration](../SECRETS-CONFIGURATION.md)

## Support

For questions or issues:
1. Check this documentation
2. Review [SECRETS-CONFIGURATION.md](../SECRETS-CONFIGURATION.md)
3. Search [Gitleaks issues](https://github.com/gitleaks/gitleaks/issues)
4. Open an issue in the CineVerse repository
