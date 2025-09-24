import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from '@/orm/sqlite/database';
import locationRoutes from '@/routes/sqlite/locationRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',  // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Routes
app.use('/api', locationRoutes);

// Connect to SQLite
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to SQLite has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

// Sync Sequelize models with the database (create tables if they don't exist)
sequelize.sync().then(() => {
  console.log('Sequelize models synced');
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
