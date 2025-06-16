import express from 'express';
import cors from 'cors';
import authRoutes from './Routers/auth.js';
import leaveRoutes from './Routers/leavesRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leave', leaveRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));