# CineVerse

A full-stack movie management application built with ASP.NET Core and React.

## 🔒 Security Notice

This project implements secure secrets management. **Never commit API keys, database credentials, or JWT secrets to source control.**

See [SECRETS-CONFIGURATION.md](SECRETS-CONFIGURATION.md) for complete setup instructions.

## 🚀 Quick Start

### Prerequisites

- .NET 9.0 SDK
- SQL Server
- Node.js (for frontend)
- TMDB API Key ([Get one here](https://www.themoviedb.org/settings/api))

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/celikmank/CineVerse.git
   cd CineVerse
   ```

2. **Configure Secrets** (Choose one method)

   **Method 1: Using appsettings.Local.json (Quick Start)**
   ```bash
   cd CineVerse
   cp appsettings.Local.example.json appsettings.Local.json
   # Edit appsettings.Local.json with your actual values
   ```

   **Method 2: Using .NET User Secrets (Recommended)**
   ```bash
   cd CineVerse
   dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Database=CineVerseDb;Trusted_Connection=True;TrustServerCertificate=True"
   dotnet user-secrets set "Jwt:Key" "YOUR_SECRET_KEY_MIN_32_CHARS"
   dotnet user-secrets set "Tmdb:ApiKey" "YOUR_TMDB_API_KEY"
   ```

3. **Run Database Migrations**
   ```bash
   cd CineVerse
   dotnet ef database update
   ```

4. **Run the Application**
   ```bash
   cd CineVerse
   dotnet run
   ```

   The API will be available at `https://localhost:5001`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd cineverse-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment (optional)**
   ```bash
   cp .env.example .env
   # Edit .env if needed
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## 📚 Documentation

- [Secrets Configuration Guide](SECRETS-CONFIGURATION.md) - Detailed guide on managing secrets securely
- [Secret Scanning Guide](docs/Secret-Scanning.md) - Automated secret leak detection with Gitleaks

## 🛠️ Built With

- **Backend**: ASP.NET Core 9.0, Entity Framework Core, SQL Server
- **Frontend**: React, Vite, TailwindCSS
- **External APIs**: TMDB API

## 🔐 Security Features

- User Secrets for development
- Environment variables support for production
- Secure JWT authentication
- API key protection
- Rate limiting
- Response caching
- Automated secret scanning with Gitleaks (CI/CD)

## 📝 License

This project is for educational purposes.

## 👥 Contributing

Please ensure you follow the secrets management guidelines when contributing. Never commit sensitive data!
