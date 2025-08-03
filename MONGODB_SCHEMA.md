# Baphomet Movie Ranking System - MongoDB Schema

## Overview

This document outlines the complete MongoDB schema for the Baphomet movie ranking system. The system uses head-to-head movie comparisons where users vote for their preferred movie in each matchup, creating an ELO-style ranking system based on win/loss records.

## System Concept

- Users are presented with two movies and choose which one they prefer
- Each comparison creates a win/loss record between those two movies
- All user votes for specific movie pairings are aggregated
- Final movie rankings are calculated as winning percentages across all matchups
- Individual user votes are tracked for analytics, fraud prevention, and personalization

---

## Collections Schema

### 1. Users Collection

Stores user account information, authentication data, and role-based permissions.

```javascript
{
  _id: ObjectId,
  username: "moviefan123",
  email: "user@example.com",
  passwordHash: "bcrypt_hashed_password", // Never store plain text passwords
  role: "user", // "admin", "moderator", "user"

  // User statistics
  totalVotes: 145,
  joinDate: Date,
  lastLogin: Date,
  isActive: true,

  // Optional profile information
  displayName: "Movie Fan",
  avatar: "https://...",
  bio: "Love watching classic films",

  // Account verification
  emailVerified: true,
  verificationToken: null,

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Movies Collection

Contains movie metadata and aggregated ranking statistics.

```javascript
{
  _id: ObjectId,
  title: "The Shawshank Redemption",
  year: 1994,
  // director: "Frank Darabont", // Getting directors requires a different call to TMDB's credit endpoint
  genre: ["Drama"],
  posterUrl: "https://...",
  tmdbId: "278", // The Movie Database ID for external API integration

  // Aggregated ranking statistics (calculated from votes)
  totalWins: 145,
  totalLosses: 23,
  winningPercentage: 86.3,
  totalComparisons: 168,

  // Metadata
  addedBy: ObjectId, // userId who added this movie
  lastUpdated: Date,
  createdAt: Date
}
```

### 3. Comparisons Collection

Tracks head-to-head matchup records between movie pairs.

```javascript
{
  _id: ObjectId,
  movie1Id: ObjectId, // reference to movies collection
  movie2Id: ObjectId, // reference to movies collection
  movie1Wins: 87,
  movie2Wins: 45,
  totalVotes: 132,

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Votes Collection

Records individual user votes for audit trail and analytics.

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  comparisonId: ObjectId, // references comparisons collection
  movie1Id: ObjectId,
  movie2Id: ObjectId,
  winnerId: ObjectId, // which movie the user chose

  // Audit trail and fraud prevention
  timestamp: Date,
  sessionId: String,
  userAgent: String
}
```

### 5. Sessions Collection

Manages user authentication sessions.

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  sessionToken: "jwt_or_session_id",
  expiresAt: Date,
  createdAt: Date,
  userAgent: String,
  ipAddress: String
}
```

### 6. Password Reset Tokens Collection

Handles secure password reset functionality.

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  resetToken: "secure_random_token",
  expiresAt: Date,
  used: false,
  createdAt: Date
}
```

---

## Database Indexes

### Performance Indexes

```javascript
// Prevent duplicate votes per user per comparison
db.votes.createIndex({ userId: 1, comparisonId: 1 }, { unique: true });

// Fast lookup of user's voting history
db.votes.createIndex({ userId: 1, timestamp: -1 });

// Fast lookup of votes for a specific matchup
db.votes.createIndex({ comparisonId: 1 });

// Fast lookup of comparisons between two movies
db.comparisons.createIndex({ movie1Id: 1, movie2Id: 1 }, { unique: true });
```

### User Management Indexes

```javascript
// Unique user identifiers
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
```

### Movie Search and Ranking Indexes

```javascript
// Movie title search
db.movies.createIndex({ title: 1 });

// Leaderboard queries (highest ranked movies)
db.movies.createIndex({ winningPercentage: -1 });

// Movies by year
db.movies.createIndex({ year: -1 });
```

---

## User Roles and Permissions

### User Role: "user" (Default)

**Permissions:**

- Vote on movie comparisons
- View all movies and rankings
- View their own voting history
- Browse movie collection

### Moderator Role: "moderator"

**Permissions:**

- All user permissions
- Add new movies to database
- Edit movie information and metadata
- Flag inappropriate content
- View basic user analytics
- Content moderation capabilities

### Admin Role: "admin"

**Permissions:**

- All moderator permissions
- Manage users (promote/demote roles, ban/unban)
- Delete movies from database
- Access full analytics dashboard
- System configuration and settings
- Database maintenance operations

---

## Data Flow and Relationships

### Voting Process

1. User selects a movie preference in a comparison
2. Vote is recorded in `votes` collection
3. Corresponding `comparison` record is updated with new totals
4. Movie win/loss statistics are recalculated in `movies` collection
5. Overall winning percentages are updated

### Key Relationships

- `votes.userId` → `users._id`
- `votes.comparisonId` → `comparisons._id`
- `votes.winnerId` → `movies._id`
- `comparisons.movie1Id` → `movies._id`
- `comparisons.movie2Id` → `movies._id`
- `movies.addedBy` → `users._id`

### Data Integrity Rules

- Users can only vote once per movie comparison
- Comparison records must reference valid movies
- Vote winner must be one of the two movies in the comparison
- Session tokens must have expiration dates
- Password reset tokens are single-use

---

## Analytics and Insights

### User Analytics

- Track voting patterns and preferences
- Identify most active users
- Monitor user engagement over time
- Detect potential fraud or bot activity

### Movie Analytics

- Most popular matchups
- Movies with highest/lowest win rates
- Trending movies by voting activity
- Genre preferences across user base

### System Analytics

- Total votes cast per day/week/month
- User registration trends
- Most controversial matchups (close vote counts)
- Geographic voting patterns (if IP tracking enabled)

---

## Security Considerations

### Authentication

- Passwords stored using bcrypt hashing
- Session-based authentication with expiration
- Email verification for new accounts
- Secure password reset flow

### Data Protection

- User IP addresses logged for fraud detection
- Session tokens with automatic expiration
- Unique constraints prevent duplicate votes
- User agent tracking for suspicious activity

### Privacy

- Optional profile information
- User voting history is private by default
- Email addresses not publicly visible
- Secure handling of personal data

---

## Scaling Considerations

### Read Optimization

- Cached movie rankings for fast leaderboard queries
- Indexed fields for common search patterns
- Pre-calculated statistics reduce computation

### Write Optimization

- Efficient vote recording with minimal overhead
- Batch updates for ranking calculations
- Optimized indexes for high-frequency operations

### Future Enhancements

- Sharding strategies for large datasets
- Read replicas for geographic distribution
- Caching layer for frequently accessed data
- Real-time ranking updates via WebSockets
