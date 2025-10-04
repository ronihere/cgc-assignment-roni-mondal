import React from 'react'
import Login from '../components/client/login'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verify } from '@/lib/auth';

export default async function page() {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

    if (session) {
        await verify(session, process.env.JWT_SECRET || '');
        redirect("/movies");
    }
    return (
        <Login />
    )
}
