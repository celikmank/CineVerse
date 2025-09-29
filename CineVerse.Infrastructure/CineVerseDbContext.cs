using CineVerse.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CineVerse.Infrastructure
{
    public class CineVerseDbContext : DbContext
    {
        public CineVerseDbContext(DbContextOptions<CineVerseDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<WatchlistItem> WatchlistItems { get; set; }
        public DbSet<FavoriteItem> FavoriteItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // WatchlistItem composite key
            modelBuilder.Entity<WatchlistItem>()
                .HasKey(w => new { w.UserId, w.MovieId });

            // FavoriteItem composite key
            modelBuilder.Entity<FavoriteItem>()
                .HasKey(f => new { f.UserId, f.MovieId });

            // İlişkiler
            modelBuilder.Entity<WatchlistItem>()
                .HasOne(w => w.User)
                .WithMany()
                .HasForeignKey(w => w.UserId);

            modelBuilder.Entity<WatchlistItem>()
                .HasOne(w => w.Movie)
                .WithMany()
                .HasForeignKey(w => w.MovieId);

            modelBuilder.Entity<FavoriteItem>()
                .HasOne(f => f.User)
                .WithMany()
                .HasForeignKey(f => f.UserId);

            modelBuilder.Entity<FavoriteItem>()
                .HasOne(f => f.Movie)
                .WithMany()
                .HasForeignKey(f => f.MovieId);
        }
    }
}
