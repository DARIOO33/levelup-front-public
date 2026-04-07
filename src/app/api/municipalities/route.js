import { NextResponse } from 'next/server';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');

    const res = await fetch(
        `https://tn-municipality-api.vercel.app/api/municipalities?name=${name}`
    );

    const data = await res.json();

    return NextResponse.json(data);
}