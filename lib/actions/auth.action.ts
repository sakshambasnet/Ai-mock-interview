'use server'

import {db, auth} from "@/firebase/admin";
import {cookies} from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
    const  {uid, name, email} = params;
    try{

        const userRecord = await db.collection('users').doc(uid).get()
        if(userRecord.exists){
            return {
                sucess: false,
                message: 'User already exists. Please sign in.',
            }
        }
        //if user doesn't exist
        await db.collection('users').doc(uid).set({
            name, email
        })

        return {
            success: true,
            message: 'Account created successfully.',
        }

    } catch (e: any){
        console.error('Error creating user', e);

        if(e.code === 'auth/email-already-exists'){
            return {
                success: false,
                message: 'User already exists',
            }
        }

        return {
            success: false,
            message: 'Failed to register user',
        }
    }
}

export async function signIn(params: SignInParams) {
    const {email, idToken} = params;

    try {
const useRecord = await auth.getUserByEmail(email);

if (!useRecord){
    return {
        success: false,
        message: "User does not exist. Create an account instead.",
    }
}

    await setSessionCookie(idToken)

    } catch (e) {
        console.error( e);

        return {
            success: false,
            message: 'Failed to login into an account',
        }
    }

}

export async function setSessionCookie(idToken: string){
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000,
    })
    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: 'lax'
    })

}

export  async function getCurrentUser(): Promise<User | null>{
    const  cookiesStore = await cookies();

    const sessionCookie = cookiesStore.get('session')?.value

    if (!sessionCookie) {
        return null
    }

    try{
   const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
   const  useRecord = await db.collection('users').doc(decodedClaims.uid).get();

   if (!useRecord.exists) return null;
   return  {
       ...useRecord.data(),
       id: useRecord.id,
   } as User

    } catch (e) {
        console.error(e)
        return null
    }

}

export async  function isAuthenticated() {
    const user = await getCurrentUser();

    return !!user;
}