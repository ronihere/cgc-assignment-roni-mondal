import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

export async function sign(payload: { userId: string, email: string, name: string }, secret: string, expires: number): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + (expires || 60 * 60);

    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(new TextEncoder().encode(secret));
}


export async function verify(token: string, secret: string): Promise<JWTPayload> {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload;
}
