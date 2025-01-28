export interface Apartment {
  id: string
  neighborhood: string
  metro: string | null
  rent: number
  rooms: number
  bedrooms: number
  burden: boolean
  surface: number
  images: {
    publicUrl: string
    fileName: string
  }[]
  appointmentDate: Date | null
  description: string | null
  comments?: {
    id: string
    content: string
    createdAt: Date
  }[]
  title: string
  createdAt: Date
  updatedAt: Date
}