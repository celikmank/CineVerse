# Secrets Configuration Guide

This project uses secure configuration management to protect sensitive data like API keys, database connection strings, and JWT secrets.

## Development Environment

### Option 1: Using appsettings.Local.json (Recommended for Quick Start)

1. Copy the example file:
   ```bash
   cd CineVerse
   cp appsettings.Local.example.json appsettings.Local.json
   ```

2. Edit `appsettings.Local.json` with your actual values:
   - `ConnectionStrings:DefaultConnection`: Your SQL Server connection string
   - `Jwt:Key`: Your JWT signing key (minimum 32 characters)
   - `Tmdb:ApiKey`: Your TMDB API key (get one from https://www.themoviedb.org/settings/api)

3. **Important**: `appsettings.Local.json` is in `.gitignore` and will never be committed to the repository.

### Option 2: Using .NET User Secrets (Recommended for Long-term Development)

User Secrets are stored outside your project directory and are never committed to source control.

1. Navigate to the CineVerse project directory:
   ```bash
   cd CineVerse
   ```

2. Initialize user secrets (already configured in the project):
   ```bash
   dotnet user-secrets init
   ```

3. Set your secrets:
   ```bash
   # Database connection string
   dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Database=CineVerseDb;Trusted_Connection=True;TrustServerCertificate=True"
   
   # JWT configuration
   dotnet user-secrets set "Jwt:Key" "YOUR_JWT_SECRET_KEY_HERE_MINIMUM_32_CHARACTERS_LONG"
   dotnet user-secrets set "Jwt:Issuer" "CineVerse"
   dotnet user-secrets set "Jwt:Audience" "CineVerseUsers"
   
   # TMDB API configuration
   dotnet user-secrets set "Tmdb:ApiKey" "YOUR_TMDB_API_KEY_HERE"
   dotnet user-secrets set "Tmdb:BaseUrl" "https://api.themoviedb.org/3/"
   ```

4. To view all secrets:
   ```bash
   dotnet user-secrets list
   ```

5. To remove a secret:
   ```bash
   dotnet user-secrets remove "Jwt:Key"
   ```

6. To clear all secrets:
   ```bash
   dotnet user-secrets clear
   ```

### Configuration Priority

ASP.NET Core loads configuration in this order (later sources override earlier ones):

1. `appsettings.json`
2. `appsettings.{Environment}.json`
3. **`appsettings.Local.json`** (our custom addition)
4. **User Secrets** (in Development environment only)
5. Environment variables
6. Command-line arguments

## Production Environment

**Never use User Secrets or appsettings.Local.json in production.**

### Option 1: Environment Variables

Set environment variables on your production server:

```bash
# Linux/macOS
export ConnectionStrings__DefaultConnection="your-connection-string"
export Jwt__Key="your-jwt-key"
export Tmdb__ApiKey="your-tmdb-api-key"

# Windows PowerShell
$env:ConnectionStrings__DefaultConnection="your-connection-string"
$env:Jwt__Key="your-jwt-key"
$env:Tmdb__ApiKey="your-tmdb-api-key"
```

Note: Use double underscores (`__`) to represent nested configuration in environment variables.

### Option 2: Azure Configuration / AWS Secrets Manager

For cloud deployments, use the platform's secret management service:

- **Azure**: Azure Key Vault + App Configuration
- **AWS**: AWS Secrets Manager or Systems Manager Parameter Store
- **Google Cloud**: Secret Manager

## Required Secrets

### Database Connection String
- **Key**: `ConnectionStrings:DefaultConnection`
- **Example**: `Server=localhost;Database=CineVerseDb;Trusted_Connection=True;TrustServerCertificate=True`
- **Notes**: Update for your environment (Azure SQL, AWS RDS, etc.)

### JWT Secret Key
- **Key**: `Jwt:Key`
- **Requirements**: Minimum 32 characters for HMAC-SHA256
- **Example**: Generate with: `openssl rand -base64 32`
- **Notes**: Keep this secret! Anyone with this key can forge authentication tokens.

### TMDB API Key
- **Key**: `Tmdb:ApiKey`
- **Get one**: https://www.themoviedb.org/settings/api
- **Notes**: Free tier available for development

## Security Best Practices

1. ✅ **Never commit secrets to source control**
2. ✅ **Use User Secrets for local development**
3. ✅ **Use environment variables or secret managers in production**
4. ✅ **Rotate secrets regularly**
5. ✅ **Use different secrets for different environments**
6. ✅ **Grant minimal required permissions**
7. ❌ **Don't share secrets via email, chat, or insecure channels**
8. ❌ **Don't hardcode secrets in source code**
9. ❌ **Don't commit appsettings.Local.json**

## Troubleshooting

### "Configuration value not found"
- Verify you've set the secret using one of the methods above
- Check the key name matches exactly (case-sensitive)
- For User Secrets, ensure you're in Development environment

### User Secrets not loading
- Verify `UserSecretsId` is present in `CineVerse.csproj`
- Ensure `ASPNETCORE_ENVIRONMENT` is set to `Development`
- Try `dotnet user-secrets list` to verify secrets are set

### appsettings.Local.json not loading
- Ensure the file is in the same directory as `appsettings.json`
- Check for JSON syntax errors
- Verify the file is named exactly `appsettings.Local.json`

## For CI/CD Pipelines

Set secrets as pipeline variables or secrets:

- **GitHub Actions**: Use repository secrets
- **Azure DevOps**: Use pipeline variables (mark as secret)
- **GitLab CI**: Use CI/CD variables (mark as protected)

## Additional Resources

- [Safe storage of app secrets in development](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets)
- [Configuration in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/)
- [Azure Key Vault configuration provider](https://learn.microsoft.com/en-us/aspnet/core/security/key-vault-configuration)
- [Secret Scanning Guide](docs/Secret-Scanning.md) - Automated secret leak detection

## Frontend (React/Vite) Configuration

The frontend uses environment variables for configuration. These are prefixed with `VITE_` for Vite.

### Development Setup

1. Copy the example file:
   ```bash
   cd cineverse-client
   cp .env.example .env
   ```

2. Edit `.env` with your values:
   - `VITE_TMDB_API_KEY`: Your TMDB API key
   - `VITE_API_BASE_URL`: Your backend API URL (default: http://localhost:5067/api)

3. **Important**: `.env` files are in `.gitignore` and will never be committed.

### Security Notes for Frontend

- **Never expose sensitive API keys in frontend code** if you can avoid it
- Consider proxying sensitive API calls through your backend
- TMDB API keys in frontend are visible to users in browser DevTools
- For production, use environment variables in your hosting platform (Vercel, Netlify, etc.)
