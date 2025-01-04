import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  // port for server
  port: parseInt(process.env.PORT as string, 10) as number,

  // mongoDB
  mongoURI: process.env.MONGODB_URI as string,

  // PostgreSQL + TypeORM
  pgHost: process.env.PG_HOST as string,
  pgPort: parseInt(process.env.PG_PORT as string, 10) as number,
  pgUser: process.env.PG_USER as string,
  pgPassword: process.env.PG_PASSWORD as string,
  pgDatabase: process.env.PG_DATABASE as string,
};
