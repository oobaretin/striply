# Striply - Diabetic Test Strip Business Management System

A comprehensive all-in-one application for managing a diabetic test strip business. Striply helps you track customers (suppliers), buyers (resale customers), products, purchases, and sales.

## Features

- **Business Owner Management**: Register and manage your business profile
- **Customer Management**: Track suppliers you buy test strips from
- **Buyer Management**: Manage your resale customers
- **Product Management**: Maintain a list of accepted test strip products
- **Purchase Tracking**: Record purchases from customers with detailed item tracking
- **Sales Tracking**: Track sales to buyers with profit calculations
- **Dashboard**: View business statistics, financials, and recent activity

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM with SQLite
- JWT Authentication
- Express Validator for input validation

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- Lucide React for icons

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies for all workspaces:**
   ```bash
   npm run install:all
   ```

2. **Set up the backend environment:**
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Edit `.env` and set your `JWT_SECRET`:
   ```
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   DATABASE_URL="file:./dev.db"
   PORT=3001
   NODE_ENV=development
   ```

3. **Initialize the database:**
   ```bash
   cd backend
   npm run db:generate
   npm run db:push
   ```

4. **Start the development servers:**
   
   From the root directory:
   ```bash
   npm run dev
   ```
   
   This will start both backend (port 3001) and frontend (port 3000) concurrently.

   Or start them separately:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## First Time Setup

1. Navigate to http://localhost:3000
2. Click "Create a new account" or go to /register
3. Fill in your business owner information
4. Once registered, you'll be automatically logged in

## Project Structure

```
teststrip/
├── backend/
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── middleware/    # Auth and error handling
│   │   ├── lib/          # Prisma client
│   │   └── index.ts      # Express app entry point
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/        # React page components
│   │   ├── components/   # Reusable components
│   │   ├── lib/          # API client
│   │   └── App.tsx       # Main app component
│   └── package.json
└── package.json          # Root workspace config
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new business owner
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Customers
- `GET /api/customers` - List all customers
- `GET /api/customers/:id` - Get customer details
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Deactivate customer

### Buyers
- `GET /api/buyers` - List all buyers
- `GET /api/buyers/:id` - Get buyer details
- `POST /api/buyers` - Create buyer
- `PUT /api/buyers/:id` - Update buyer
- `DELETE /api/buyers/:id` - Deactivate buyer

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Deactivate product

### Purchases
- `GET /api/purchases` - List all purchases
- `GET /api/purchases/:id` - Get purchase details
- `POST /api/purchases` - Create purchase
- `PUT /api/purchases/:id` - Update purchase
- `DELETE /api/purchases/:id` - Delete purchase

### Sales
- `GET /api/sales` - List all sales
- `GET /api/sales/:id` - Get sale details
- `POST /api/sales` - Create sale
- `PUT /api/sales/:id` - Update sale
- `DELETE /api/sales/:id` - Delete sale

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Database Schema

The application uses SQLite with Prisma ORM. Key entities:

- **BusinessOwner**: Your business profile
- **Customer**: Suppliers you buy from
- **Buyer**: Customers you resell to
- **Product**: Test strip products you accept
- **Purchase**: Purchases from customers with items
- **Sale**: Sales to buyers with items

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Consider using PostgreSQL instead of SQLite:
   - Update `DATABASE_URL` in `.env`
   - Change `provider` in `schema.prisma` to `postgresql`
   - Run migrations: `npm run db:migrate`

### Frontend
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Serve the `dist` folder with a web server (nginx, Apache, etc.)
3. Update API URL in production environment variables

## Security Notes

- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- All API routes (except auth) require authentication
- Input validation on all endpoints
- SQL injection protection via Prisma

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team.

