Server port: 5000
Client port: 5173

Backend API runs on: http://localhost:5000/api
Frontend runs on: http://localhost:5173

Endpoints:
GET /api/movies - Get all movies
GET /api/movies/:id - Get movie details
POST /api/movies - Create movie (admin)

GET /api/shows - Get shows with filters
GET /api/shows/upcoming - Get upcoming shows
POST /api/shows - Create show (admin)

POST /api/bookings - Create booking
GET /api/bookings/user/all - Get user bookings
GET /api/bookings/:id - Get booking details

POST /api/payments/intent - Create payment intent
POST /api/payments/success - Handle payment success
POST /api/payments/:paymentId/refund - Refund payment

GET /api/users/profile - Get user profile
PUT /api/users/profile - Update profile

GET /api/admin/dashboard - Admin dashboard stats
GET /api/admin/movies - All movies (admin)
GET /api/admin/shows - All shows (admin)
GET /api/admin/bookings - All bookings (admin)
GET /api/admin/revenue/report - Revenue report
