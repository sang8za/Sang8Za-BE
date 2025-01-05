import express, { Request, Response, NextFunction } from 'express';
import routes from './routes';
import logger from './middlewares/requestLogger';
import config from './config';
import cors from 'cors';
import { closePool } from './config/db';

const app = express();

const allowedOrigins = ['http://localhost:3000', config.ec2Host];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  const origin: string = req.headers.origin!;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With, content-type, x-access-token'
  );
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(logger);
app.use(routes);

interface ErrorType {
  message: string;
  status: number;
}

app.use(function (
  err: ErrorType,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'production' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await closePool();
  process.exit(0);
});

export default app;
