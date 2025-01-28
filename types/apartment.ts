export interface Apartment {
  id: string
  neighborhood: string
  metro: string
  rent: number
  rooms: number
  bedrooms: number
  burden: boolean
  images: {
    publicUrl: string
  }[]
  appointmentDate: Date
  description: string
  comments: string[]
  title: string
}

