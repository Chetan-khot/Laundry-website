# Quick Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Create .env file** (in root directory)
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/laundry_db
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   NODE_ENV=development
   ```

3. **Start MongoDB**
   - If using local MongoDB: Make sure MongoDB service is running
   - If using MongoDB Atlas: Update MONGODB_URI in .env file

4. **Start the Server**
   ```bash
   npm run dev
   ```
   or
   ```bash
   npm start
   ```

5. **Access the Application**
   - Open browser: `http://localhost:5000`

## Testing the API

### Register a new user:
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "address": "123 Main St, City, State"
}
```

### Login:
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create an order (requires auth token):
```bash
POST http://localhost:5000/api/orders
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "serviceType": "Wash & Fold",
  "weight": 5,
  "pickupAddress": "123 Main St",
  "pickupDate": "2025-01-20T10:00:00Z"
}
```

## Frontend-Backend Integration

The frontend now uses the backend API through the `frontend/js/api.js` module. The frontend automatically:
- Sends authentication tokens with API requests
- Stores JWT tokens in localStorage
- Falls back to localStorage for backward compatibility

## Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running: `mongod` or check MongoDB service
- Verify MONGODB_URI in .env file
- For MongoDB Atlas: Ensure IP is whitelisted and credentials are correct

### CORS Issues
- CORS is enabled for all origins in development
- If issues persist, check server.js cors configuration

### Module Import Issues
- Make sure you're accessing the site through the server (http://localhost:5000)
- Don't open HTML files directly (file://) - ES6 modules won't work

### Port Already in Use
- Change PORT in .env file
- Or kill the process using port 5000

## Production Deployment

1. Set NODE_ENV=production
2. Use a strong JWT_SECRET
3. Use MongoDB Atlas or managed MongoDB
4. Configure proper CORS origins
5. Use environment variables for all secrets
6. Enable HTTPS
7. Integrate with real payment gateway

