# Youth Pride Project 🏳️‍🌈

Next.js application for the Youth Pride Project event, featuring LIFF registration, a checkpoint-based quiz system, and a trophy dashboard.

## 🚀 Getting Started (First Time Setup)

Follow these steps to get the project running on your local machine:

### 1. Database Setup (Docker)
Start the PostgreSQL database and pgAdmin using Docker Compose:
```bash
docker-compose up -d
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create or update your `.env` file. For high-performance (5,000+ TPS), we use **PgBouncer**:
```env
# Connection via PgBouncer (Port 6432)
DATABASE_URL="postgresql://postgres:password123@localhost:6432/pridedb?schema=public&pgbouncer=true"

# LIFF Settings
NEXT_PUBLIC_LIFF_ID="your-liff-id-here"
```

### 4. Database Migration & Seeding (Prisma 7)
Initialize the database schema and seed the checkpoints:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Run Development Server
```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 🛠 Tech Stack
- **Frontend**: Next.js 15 (App Router)
- **Styling**: Premium Vanilla CSS
- **Database**: PostgreSQL (via Docker)
- **Pooling**: PgBouncer (Transaction Mode)
- **ORM**: Prisma 7 (with Database Adapter)
- **Auth**: LINE Front-end Framework (LIFF)

## 🐳 Docker Services
- **PgBouncer**: Port `6432` (Recommended for High Traffic)
- **PostgreSQL**: Port `5435` (Direct Access)
- **pgAdmin**: Port `8080` (User: `admin@admin.com`, Pass: `admin`)
