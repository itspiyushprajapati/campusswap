# CampusSwap

A peer-to-peer marketplace platform for university students to buy, sell, and swap items on campus.

## Features

- **Browse Listings**: Discover textbooks, electronics, furniture, clothing, and more from fellow students
- **Create Listings**: Post items you want to sell or swap with photos and descriptions
- **Filter & Search**: Find exactly what you need with category filters and search
- **Secure Communication**: Built-in messaging between buyers and sellers

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd campusswap
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Set up the database:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## Project Structure

```
campusswap/
├── CLAUDE.md              # Engineering guidelines
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   │   ├── ui/          # Base UI components
│   │   ├── items/       # Item-related components
│   │   └── layout/      # Layout components
│   ├── lib/             # Utilities and configs
│   ├── models/          # TypeScript types
│   └── services/        # Business logic
├── prisma/
│   └── schema.prisma    # Database schema
└── public/              # Static assets
```

## Architecture

The project follows a layered architecture:

- **Controllers** (App Router): API handlers and page routes
- **Services**: Business logic and data operations
- **Models**: TypeScript types and database schema
- **Utilities**: Reusable helper functions

## Database Schema

See `prisma/schema.prisma` for the complete database schema including:

- **User**: Accounts, profiles, university affiliation
- **Item**: Listings with images, price, condition
- **Category**: Item organization
- **Message**: Buyer-seller communication
- **Transaction**: Sale/swap records

## Contributing

See `CLAUDE.md` for engineering guidelines and contribution standards.

## License

MIT
