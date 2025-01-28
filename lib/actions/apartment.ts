"use server"

import { revalidatePath } from "next/cache"
import {prisma} from "@/lib/prisma";

export async function updateAppointmentDate(apartmentId: string, date: Date) {
    try {
        await prisma.apartment.update({
            where: {
                id: apartmentId,
            },
            data: {
                appointmentDate: date,
            },
        })

        revalidatePath(`/apartment/${apartmentId}`)
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to update appointment date" }
    }
}

export async function addComment(apartmentId: string, userId: string, content: string) {
    try {
        await prisma.comment.create({
            data: {
                content,
                apartmentId,
                userId,
            },
        })
        revalidatePath(`/apartment/${apartmentId}`)
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to add comment" }
    }
}

export async function getComments(apartmentId: string) {
    try {
        const comments = await prisma.comment.findMany({
            where: {
                apartmentId,
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        })
        return comments
    } catch (error) {
        return []
    }
}


export async function deleteApartment(apartmentId: string) {
    try {
        await prisma.apartment.delete({
            where: {
                id: apartmentId,
            },
        })

        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Error deleting apartment:", error)
        return { success: false, error: "Failed to delete apartment" }
    }
}

export async function deleteAppointmentDate(apartmentId: string) {
    try {
        await prisma.apartment.update({
            where: { id: apartmentId },
            data: { appointmentDate: null }
        })

        revalidatePath(`/apartment/${apartmentId}`)
        return { success: true }
    } catch (error) {
        console.error("Error deleting appointment date:", error)
        return { success: false, error: "Failed to delete appointment date" }
    }
}

export async function deleteComment(commentId: string, apartmentId: string) {
    try {
        await prisma.comment.delete({
            where: { id: commentId }
        })

        revalidatePath(`/apartment/${apartmentId}`)
        return { success: true }
    } catch (error) {
        console.error("Error deleting comment:", error)
        return { success: false, error: "Failed to delete comment" }
    }
}