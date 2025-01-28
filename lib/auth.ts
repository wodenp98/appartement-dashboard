import {compare, hash} from "bcryptjs";
import {cookies} from "next/headers"
import {prisma} from "@/lib/prisma";

const COOKIE_NAME = "auth.session";

export type CreateUserData = {
    email: string;
    password: string;
    name: string;
}

export async function createUser({email, password, name}: CreateUserData) {
    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            passwordHash: hashedPassword,
        }
    });

    const session = await prisma.session.create({
        data: {
            userId: user.id,
            sessionToken: crypto.randomUUID(),
            expiresAt: new Date(Date.now() + 1000 * 24 * 60 * 60 * 1000),
        }
    });

    await updateSession(session.sessionToken);

    return {user, session};
}

export async function login(email: string, password: string) {
    const user = await prisma.user.findUnique({
        where: {email}
    });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const passwordValid = await compare(password, user.passwordHash);

    if (!passwordValid) {
        throw new Error("Invalid email or password");
    }

    const session = await prisma.session.create({
        data: {
            userId: user.id,
            sessionToken: crypto.randomUUID(),
            expiresAt: new Date(Date.now() + 1000 * 24 * 60 * 60 * 1000),
        }
    });

    await updateSession(session.sessionToken);

    return {user, session};
}

export async function auth() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(COOKIE_NAME)?.value;

    if (!sessionToken) {
        return null;
    }

    const session = await prisma.session.findUnique({
        where: {sessionToken},
        include: {
            user: true
        }
    });

    if (!session) {
        return null;
    }

    if (session.expiresAt < new Date()) {
        await prisma.session.delete({
            where: {id: session.id}
        });

        return null;
    }

    return session.user;
}

export async function updateSession(token: string) {
    const cookieStore = await cookies();

    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(Date.now() + 1000 * 24 * 60 * 60 * 1000),
    });
}

export async function logout() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(COOKIE_NAME)?.value;

    if (sessionToken) {
        await prisma.session.delete({
            where: {sessionToken}
        });
    }

    cookieStore.delete(COOKIE_NAME);
}