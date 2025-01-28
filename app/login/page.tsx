import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/auth";
import { LoginSchema } from "@/lib/validation";
import Link from "next/link";
import { redirect } from "next/navigation";
import { z } from "zod";

export default function LoginPage() {
    async function handleLogin(formData: FormData) {
        "use server";

        const validatedFields = LoginSchema.safeParse({
            email: formData.get("email"),
            password: formData.get("password"),
        });

        if (!validatedFields.success) {
            throw new Error(validatedFields.error.errors[0].message);
        }

        try {
            await login(
                validatedFields.data.email,
                validatedFields.data.password
            );
            redirect("/");
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new Error(error.errors[0].message);
            }
            throw error;
        }
    }

    return (
        <main className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-muted-foreground">Please enter your credentials</p>
                </div>

                <form action={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email
                        </label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="name@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">
                            Password
                        </label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        Sign in
                    </Button>
                </form>
            </div>
        </main>
    );
}