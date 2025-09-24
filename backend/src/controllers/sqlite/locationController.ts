import { Request, Response } from 'express';
import Location from '@/models/sqlite/Location';

// Fetch all locations
export const getLocations = async (req: Request, res: Response) => {
  try {
    const locations = await Location.findAll();
    res.json(locations);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Create a new location
export const createLocation = async (req: Request, res: Response) => {
  try {
    const { name, date, description, image } = req.body;
    const newLocation = await Location.create({ name, date, description, image });
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(500).send(error);
  }
};
