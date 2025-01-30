import ApartmentCard from "@/components/ApartmentCard"
import Link from "next/link"
import {Button} from "@/components/ui/button";
import {Apartment} from "@/types/apartment";
import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";
import {prisma} from "@/lib/prisma";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Info} from "lucide-react";

async function getApartments() {
    const apartments = await prisma.apartment.findMany({
        include: {
            images: {
                take: 1,
            },
        },
        orderBy: {
            appointmentDate: 'asc',
        }
    });

    return apartments;
}

export default async function Home() {
    const user = await auth();

    if (!user) {
        redirect("/");
    }
    const apartments = await getApartments()

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold mb-8">Appartements candidatés</h1>
                <Popover>
                    <PopoverTrigger><Info /></PopoverTrigger>
                    <PopoverContent><p>Lit: <span>160 largeur x 200 longueur</span></p>
                        <p>Canapé: <span>200 largeur x 95 longueur</span></p>
                        <p>Bureau: <span>120 largeur x 70 longueur</span></p>
                        <p>Dressings (x3): <span>96 largeur x 58 longueur</span></p>
                        <p>Meuble: <span>90 largeur x 40 longueur</span></p></PopoverContent>
                </Popover>

            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {apartments.map((apartment: Apartment) => (
                    <ApartmentCard key={apartment.id} apartment={apartment} />
                ))}
            </div>
            <div className="w-full flex items-center justify-center mt-8">
                <Link href="/add-apartment" className="">
                    <Button>Ajouter un appartement</Button>
                </Link>
            </div>

        </main>
    )
}

