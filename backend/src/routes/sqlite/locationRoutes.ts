import express from 'express';
import { getLocations, createLocation } from '@/controllers/sqlite/locationController';

const router = express.Router();

router.get('/locations', getLocations);
router.post('/locations', createLocation);

export default router;
