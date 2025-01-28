import {Apartment} from "@/components/Apartment/Apartment";
import {prisma} from "@/lib/prisma";
import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";

async function getApartment(apartmentId: string) {
    const getApartment = await prisma.apartment.findFirst({
        where: {
            id: apartmentId,
        },
        include: {
            images: true,
            comments: true,
        }
    })

    return getApartment
}

export default async function ApartmentPage({
                                          params,
                                      }: {
    params: Promise<{ id: string }>
}) {
    const user = await auth()
    const { id: apartmentId } = await params
    if (!user) {
        redirect("/");
    }
    const apartment = await getApartment(apartmentId)

    if(!apartment) {
        return redirect("/404")
    }

    return (
        <Apartment apartment={apartment} userId={user.id} />
    )
}

