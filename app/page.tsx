import {Button, buttonVariants} from "@/components/ui/button";
import {auth, logout} from "@/lib/auth";
import {revalidatePath} from "next/cache"
import {redirect} from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const user = await auth();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 p-6 text-center md:p-10">
      {user ? (
          <div className="flex flex-col items-center gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl">Bien essayé!</h1>
              <p className="text-lg text-muted-foreground">Dans le void</p>
            </div>
            <form>
              <Button size="lg" variant="destructive" formAction={async () => {
                "use server";
                await logout();
                revalidatePath("/");
              }}>
                Sign Out
              </Button>
            </form>
          </div>
      ): (
          <div className="flex flex-col items-center gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Appartements</h1>
                <p>Connecte toi 😄</p>
            </div>
            <div className="flex gap-4">
              <Link href="/login" className={buttonVariants({size: "lg"})}>
                Se connecter
              </Link>
            </div>
          </div>
      )}
    </main>
  )
}

