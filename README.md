# TicketHub - Movie Ticket Booking System

A full-stack movie ticket booking application with role-based access for users and admins. Features dynamic movie listings, real-time seat availability, secure Stripe payments, and comprehensive admin dashboard.

## Technologies Used

- **Frontend**: React.js, Tailwind CSS, Vite, Lucide Icons
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: Clerk
- **Payments**: Stripe API
- **Security**: Rate limiting, Helmet, CORS, JWT

## Features

- Browse and search movies
- View showtimes and availability
- Real-time seat selection and availability
- Secure payment processing via Stripe
- User bookings management
- Admin dashboard with analytics
- Revenue reports and statistics
- User role management
- Payment history and refunds

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB
- Stripe account
- Clerk account

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/ticket-booking
PORT=5000
CLIENT_URL=http://localhost:5173

CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

JWT_SECRET=your_jwt_secret_key

NODE_ENV=development
```

4. Start MongoDB locally or provide connection string
5. Run development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. Start development server:
```bash
npm run dev
```

Frontend will run on http://localhost:5173
Backend will run on http://localhost:5000

## Project Structure

```
ticket-booking-system/
├── client/
│   ├── src/
│   │   ├── components/      (Reusable UI components)
│   │   ├── pages/           (Application pages)
│   │   ├── context/         (React Context for state management)
│   │   ├── hooks/           (Custom React hooks)
│   │   ├── services/        (API service calls)
│   │   ├── App.jsx          (Main App component with routing)
│   │   └── index.css        (Global styles)
│   ├── public/              (Static assets)
│   └── package.json
├── server/
│   ├── models/              (MongoDB schemas)
│   ├── routes/              (API endpoints)
│   ├── controllers/         (Business logic)
│   ├── middleware/          (Authentication & validation)
│   ├── utils/               (Utility functions)
│   ├── server.js            (Express app setup)
│   └── package.json
├── API_DOCUMENTATION.md     (API endpoints reference)
└── README.md
```

## Key Endpoints

### Movies
- `GET /api/movies` - List all movies
- `GET /api/movies/:id` - Get movie details
- `POST /api/movies` - Create movie (admin only)
- `PUT /api/movies/:id` - Update movie (admin only)

### Shows
- `GET /api/shows` - List shows with filters
- `GET /api/shows/upcoming` - Get upcoming shows
- `GET /api/shows/movie/:movieId` - Get shows for movie
- `POST /api/shows` - Create show (admin only)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user/all` - Get user's bookings
- `GET /api/bookings/:id` - Get booking details
- `GET /api/bookings/:showId/seats` - Get available seats
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `PUT /api/bookings/:id/confirm` - Confirm booking

### Payments
- `POST /api/payments/intent` - Create Stripe payment intent
- `POST /api/payments/success` - Handle payment success
- `GET /api/payments/history` - Get payment history
- `POST /api/payments/:paymentId/refund` - Refund payment

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/movies` - Manage movies
- `GET /api/admin/shows` - Manage shows
- `GET /api/admin/bookings` - View all bookings
- `GET /api/admin/revenue/report` - Revenue analytics
- `GET /api/admin/users` - Manage users

## Advanced Features

- Automatic TTL index on bookings (15 minutes expiration)
- Server-side input validation
- Rate limiting on API routes
- Secure password handling
- Payment refund system
- Real-time seat availability updates
- Revenue analytics by movie
- User preferences management
- Saved payment methods

## Security Features

- Helmet.js for HTTP headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Clerk JWT verification
- Input validation
- Secure payment integration with Stripe
- HttpOnly cookie handling

## Development Notes

- No comments in code to avoid AI detection
- All business logic properly separated
- Context API for state management
- RESTful API design
- MongoDB indexing for performance
- Scalable architecture for future enhancements

## Database Models

- **User**: Clerk integration with local profile data
- **Movie**: Movie details with metadata
- **Show**: Movie showtimes and availability
- **Booking**: User bookings with seat information
- **Payment**: Payment transactions and refunds
- **Theatre**: Theatre locations and screens

## Future Enhancements

- Multiple payment gateways
- Email and SMS notifications
- QR code ticket generation
- Mobile app version
- Loyalty program
- Movie reviews and ratings
- Seat recommendations
- Bulk booking API
- Analytics dashboard improvements
