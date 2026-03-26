import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

import { router, protected_router } from './routes/routes';
import { notFoundHandler } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// app-level middleware
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(express.json())
app.use(morgan('dev'))
app.use(helmet())

// use the routes
app.use('/api', router);
app.use('/api/protected', protected_router);

// custom route-level middleware
app.use(notFoundHandler)
app.use(errorHandler)

export default app;