# DS Properties Management System

A comprehensive real estate plotting business management system for DS Properties.

## Overview

This is a full-stack web application designed for DS Properties, a real estate plotting business. The system helps manage customers, plots, income, expenses, and provides detailed reporting capabilities.

## Features

- **Authentication**: Secure user registration and login with JWT tokens
- **Dashboard**: Financial overview with key metrics and trends
- **Customer Management**: Complete CRUD operations for customer records
- **Plot Management**: Track plot inventory with status (Available, Booked, Sold)
- **Income Tracking**: Record customer payments and installment plans
- **Expense Tracking**: Categorize and track business expenses
- **Reports & Analytics**: Generate detailed reports on sales, expenses, and financial performance
- **Export Capabilities**: Export reports to PDF and Excel formats

## Technology Stack

### Backend
- Node.js with Express.js
- PostgreSQL database
- JWT for authentication
- Joi for validation

### Frontend
- React with functional components and hooks
- React Router for navigation
- Chart.js for data visualization
- Axios for API communication

## Project Structure

```
DS-Properties-Management-System/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── schema.sql
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── PROJECT_HANDOFF.md
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a PostgreSQL database and run the schema:
   ```sql
   CREATE DATABASE ds_properties;
   \i schema.sql
   ```

4. Update the `.env` file with your database credentials.

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## API Documentation

For detailed API documentation, please refer to the [PROJECT_HANDOFF.md](PROJECT_HANDOFF.md) file.

## Development Guidelines

- Follow clean architecture principles
- Use scalable folder structure
- Write reusable components
- Implement proper validation
- Use environment variables correctly
- Use production-ready API design
- Use secure authentication and authorization

## Contributing

Please refer to the [PROJECT_HANDOFF.md](PROJECT_HANDOFF.md) file for detailed information about the project architecture, implemented features, pending features, and recommended next steps.

## License

This project is proprietary to DS Properties.