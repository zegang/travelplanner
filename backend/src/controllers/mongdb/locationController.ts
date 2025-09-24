import { Request, Response } from 'express'
import LocationModel from '../../models/mongdb/Location'

export const getLocations = async (req: Request, res: Response) => {
  try {
    const locations = await LocationModel.find()
    res.json(locations)
  } catch (error) {
    res.status(500).send(error)
  }
}

export const createLocation = async (req: Request, res: Response) => {
  try {
    const newLocation = new LocationModel(req.body)
    await newLocation.save()
    res.status(201).json(newLocation)
  } catch (error) {
    res.status(500).send(error)
  }
}
