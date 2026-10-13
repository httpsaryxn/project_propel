const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
dotenv.config();

const app = require('./app');
const { testConnection } = require('./config/db');

const PORT = process.env.PORT || 5000;

testConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Project Propel Backend Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to PostgreSQL database:', err);
    process.exit(1);
  });
