"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { Apartment as ApartmentType } from "@/types/apartment"
import { format } from "date-fns"
import { fr } from "date-fns/locale";
import {CalendarIcon, X} from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    updateAppointmentDate,
    addComment,
    getComments,
    deleteApartment,
    deleteComment,
    deleteAppointmentDate
} from "@/lib/actions/apartment"
import { useToast } from "@/components/ui/use-toast"
import AnimatedSubmitButton from "@/components/Apartment/AnimatedButton";
import {useRouter} from "next/navigation";
import {Trash2} from "lucide-react";
import {AlertDialog, AlertDialogAction, AlertDialogFooter, AlertDialogTrigger, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle} from "@/components/ui/alert-dialog";


interface ApartmentCardProps {
    apartment: ApartmentType
    userId: string
}

interface Comment {
    id: string
    content: string
    createdAt: Date
    user: {
        name: string
    }
}

export const Apartment = ({ apartment, userId }: ApartmentCardProps) => {
    const router = useRouter()
    const [date, setDate] = useState<Date | undefined>(apartment.appointmentDate || undefined)
    const [comment, setComment] = useState("")
    const [comments, setComments] = useState<Comment[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const {toast} = useToast()

    useEffect(() => {
        loadComments()
    }, [])

    const loadComments = async () => {
        const fetchedComments = await getComments(apartment.id)
        setComments(fetchedComments)
    }

    const handleDateUpdate = async () => {
        if (!date) return

        setIsLoading(true)
        const result = await updateAppointmentDate(apartment.id, date)
        console.log(result.success)
        setIsLoading(false)
        if (result.success) {
            return result
        }
    }

    const handleCommentSubmit = async () => {
        if (!comment.trim()) return

        setIsLoading(true)
        const result = await addComment(apartment.id, userId, comment)
        setIsLoading(false)

        if (result.success) {
            setComment("")
            await loadComments()
            return result
        }
    }

    const handleDelete = async () => {
        setIsLoading(true)
        const result = await deleteApartment(apartment.id)
        setIsLoading(false)

        if (result.success) {
            router.push("/")
        }
        }

    const handleDateDelete = async () => {
        setIsLoading(true)
        const result = await deleteAppointmentDate(apartment.id)
        setIsLoading(false)

        if (result.success) {
            setDate(undefined)
            toast({
                title: "Date supprimée",
                description: "La date de rendez-vous a été supprimée.",
            })
        } else {
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la suppression de la date.",
                variant: "destructive",
            })
        }
    }

    const handleCommentDelete = async (commentId: string) => {
        setIsLoading(true)
        const result = await deleteComment(commentId, apartment.id)
        setIsLoading(false)

        if (result.success) {
            await loadComments()
            toast({
                title: "Commentaire supprimé",
                description: "Le commentaire a été supprimé avec succès.",
            })
        } else {
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la suppression du commentaire.",
                variant: "destructive",
            })
        }
    }

    return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8">{apartment.title}</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Carousel className="w-full max-w-xl mx-auto">
                            <CarouselContent>
                                {apartment.images.map((photo, index) => (
                                    <CarouselItem key={index}>
                                        <div className="relative h-64 sm:h-96">
                                            <Image
                                                src={photo.publicUrl}
                                                alt={`Apartment photo ${index + 1}`}
                                                fill
                                                priority
                                                className="object-cover"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious/>
                            <CarouselNext/>
                        </Carousel>
                        <Card className="mt-8">
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                                <div className="my-4">
                                    <p><strong>Prix:</strong> {apartment.rent}€/mois</p>
                                    <p><strong>Charges:</strong> {apartment.burden ? "Comprises" : "Non comprises"}</p>
                                    <p><strong>Pièces:</strong> {apartment.rooms}</p>
                                    <p><strong>Chambres:</strong> {apartment.bedrooms}</p>
                                    <p><strong>Surface:</strong> {apartment.surface}m²</p>
                                    <p><strong>Arrondissement:</strong> {apartment.neighborhood}</p>
                                    <p><strong>Metro:</strong> {apartment.metro}</p>
                                </div>
                                <p>{apartment.description}</p>
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">Date du rendez-vous</h2>
                                <div className="flex gap-2 items-center">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "flex-1 justify-start text-left font-normal",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, "d MMMM yyyy", { locale: fr }) : <span>Choisir une date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {date && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleDateDelete}
                                            className="shrink-0"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                <AnimatedSubmitButton
                                    // @ts-ignore
                                    onClick={handleDateUpdate}
                                    disabled={!date}
                                    className="w-full mt-4"
                                />
                            </CardContent>
                        </Card>
                        <Card className="mt-8">
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">Commentaires</h2>
                                <div className="space-y-4 mb-6">
                                    {comments.map((comment) => (
                                        <div key={comment.id} className="bg-muted p-3 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-sm text-muted-foreground">
                                                        {comment.user.name} • {format(new Date(comment.createdAt), "d MMMM yyyy", { locale: fr })}
                                                    </p>
                                                    <p className="mt-1">{comment.content}</p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleCommentDelete(comment.id)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Textarea
                                    placeholder="Ajouter un commentaire..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="mb-4"
                                />
                                <AnimatedSubmitButton
                                    // @ts-ignore
                                    onClick={handleCommentSubmit}
                                    disabled={isLoading || !comment.trim()}
                                    className="w-full"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <div className="w-full mt-8 flex items-center justify-center">
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4"/>
                                Supprimer
                            </Button>
                        </div>

                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Cette action est irréversible. Cela supprimera définitivement cet appartement
                                et toutes les données associées.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Supprimer
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        )
    }
