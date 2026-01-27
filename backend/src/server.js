const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');

const requiredEnv = ['JWT_SECRET'];
const missingEnv = requiredEnv.filter((k) => !process.env[k]);
if (missingEnv.length) {
  console.error(`Missing environment variables: ${missingEnv.join(',')}`);
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server runningg in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
