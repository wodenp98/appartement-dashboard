"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { addApartment } from "@/lib/actions/addAppartment"
import {Checkbox} from "@/components/ui/checkbox";

export default function AddApartmentPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const form = e.currentTarget

      const formData = new FormData(form)

      const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput?.files) {
        formData.delete('photos')
        for (const file of fileInput.files) {
          formData.append('photos', file)
        }
      }

      const result = await addApartment(formData)

      if (result.success) {
        router.push(`/apartment/${result.id}`)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add apartment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Ajouter un appartemment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Titre</Label>
                  <Input id="title" name="title" required />
                </div>
                <div>
                  <Label htmlFor="district">Quartier</Label>
                  <Input id="district" name="district" required />
                </div>
                <div>
                  <Label htmlFor="metro">Metro</Label>
                  <Input id="metro" name="metro" required />
                </div>
                <div>
                  <Label htmlFor="price">Loyer par mois</Label>
                  <Input id="price" name="price" type="number" required />
                </div>
                  <div className="flex items-center space-x-4">
                    <Label htmlFor="burden">Charges Comprises</Label>
                    <Checkbox id="burden" name="burden" />

                  </div>
                <div>
                  <Label htmlFor="size">Surface</Label>
                  <Input id="size" name="size" type="number" required />
                </div>
                <div>
                  <Label htmlFor="rooms">Nombre de pièces</Label>
                  <Input id="rooms" name="rooms" type="number" required />
                </div>
                <div>
                  <Label htmlFor="bedrooms">Nombre de chambre</Label>
                  <Input id="bedrooms" name="bedrooms" type="number" required />
                </div>

                <div>
                  <Label htmlFor="photos">Ajouter Photos</Label>
                  <Input
                      id="photos"
                      name="photos"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      multiple
                      required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Apartment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
  )
}