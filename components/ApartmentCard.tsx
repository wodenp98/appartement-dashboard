import Image from "next/image"
import Link from "next/link"
import {Card, CardContent, CardFooter} from "@/components/ui/card"
import type {Apartment} from "@/types/apartment"

interface ApartmentCardProps {
    apartment: Apartment,
}

export default function ApartmentCard({apartment}: ApartmentCardProps) {
    return (
        <Link href={`/apartment/${apartment.id}`} className="w-full">
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    <div className="relative h-64">
                        <Image
                            src={apartment.images[0].publicUrl}
                            alt={apartment.images[0].fileName}
                            fill
                            priority
                            className="object-cover"
                        />
                    </div>
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold mb-2">{apartment.title}</h2>
                        {apartment.appointmentDate && (
                            <p className="mb-2">RDV: {new Date(apartment.appointmentDate).toLocaleDateString('fr-FR')}</p>
                        )}
                        </div>
                        <p className="text-gray-600 mb-2">{apartment.neighborhood}</p>
                        <p className="font-bold text-lg mb-2">{apartment.rent}€/mois</p>
                        <p>Charges: {apartment.burden ? "Comprises" : "Non comprises"}</p>
                        <p>{apartment.surface} m²</p>
                        <p>
                            {apartment.rooms} pièces • {apartment.bedrooms} chambre{apartment.bedrooms > 1 ? "s" : ""}
                        </p>
                    </div>
                </CardContent>

            </Card>
        </Link>
    )
}

