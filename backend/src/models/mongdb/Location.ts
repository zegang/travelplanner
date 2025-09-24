import { Schema, model } from 'mongoose'

interface Location {
  name: string
  date: string
  description: string
  image: string
}

const locationSchema = new Schema<Location>({
  name: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
})

const LocationModel = model<Location>('Location', locationSchema)

export default LocationModel
