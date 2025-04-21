'use server'
 
import { cookies } from 'next/headers'
 
export async function deleteToken(data: any) {
  (await cookies()).delete('token');
}