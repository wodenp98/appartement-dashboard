"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import {prisma} from "@/lib/prisma"
import sharp from "sharp"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function addApartment(formData: FormData) {
    try {
        const title = formData.get('title') as string
        const district = formData.get('district') as string
        const metro = formData.get('metro') as string
        const price = formData.get('price') as string
        const size = formData.get('size') as string
        const rooms = formData.get('rooms') as string
        const bedrooms = formData.get('bedrooms') as string
        const description = formData.get('description') as string
        const burden = formData.get('burden') as boolean
        const photos = formData.getAll('photos') as File[]

        if (!district || !price || !rooms || !bedrooms) {
            return { success: false, error: "Missing required fields" }
        }

        const apartment = await prisma.apartment.create({
            data: {
                title,
                description,
                rooms: parseInt(rooms),
                bedrooms: parseInt(bedrooms),
                rent: parseFloat(price),
                neighborhood: district,
                burden: burden === "on",
                metro,
                surface: parseInt(size),
            },
        })

        const imagePromises = photos.map(async (photo, index) => {
            const arrayBuffer = await photo.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)

            const processedBuffer = await sharp(buffer)
                .webp({ quality: 80 })
                .resize(1920, 1080, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .toBuffer()

            const fileName = `${apartment.id}/photo${index + 1}.webp`

            const { error: uploadError } = await supabase
                .storage
                .from('images')
                .upload(fileName, processedBuffer, {
                    contentType: 'image/webp',
                    upsert: false
                })

            if (uploadError) throw uploadError

            const { data: { signedUrl } } = await supabase
                .storage
                .from('images')
                .createSignedUrl(fileName, 31536000)

            if (!signedUrl) throw new Error('Failed to create signed URL')

            return prisma.apartmentImage.create({
                data: {
                    fileName,
                    publicUrl: signedUrl,
                    apartmentId: apartment.id
                }
            })
        })

        await Promise.all(imagePromises)

        revalidatePath('/')
        return { success: true, id: apartment.id }
    } catch (error) {
        console.error('Error in addApartment:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Failed to add apartment' }
    }
}