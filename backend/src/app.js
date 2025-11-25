import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import petRoutes from './routes/pets.js';
import vaccineRoutes from './routes/vaccines.js';
import medicationRoutes from './routes/medications.js';
import reminderRoutes from './routes/reminders.js';
import examRoutes from './routes/exams.js';
import appointmentRoutes from './routes/appointments.js';
import fleaRoutes from './routes/fleas.js';
import bathRoutes from './routes/bath.js';
import hygieneRoutes from './routes/hygiene.js';
import userRoutes from './routes/users.js';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/vaccines', vaccineRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/fleas', fleaRoutes);
app.use('/api/bath', bathRoutes);
app.use('/api/hygiene', hygieneRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req,res)=>res.json({ok:true, service:'petcare-backend'}));

// serve frontend build if exists
try{
  const dist = path.join(process.cwd(), '..', 'frontend', 'dist');
  if(fs.existsSync(dist)){
    app.use(express.static(dist));
    app.get('*', (req,res)=>{
      res.sendFile(path.join(dist, 'index.html'));
    });
  }
}catch(e){ /* optional */ }

export default app;
