'use server';

import { signIn, signOut } from '../authhandlers/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { compileActivationTemplate, compileResetPassTemplate, sendMail } from '@/lib/mail';
import { signJwt,verifyJwt } from '@/lib/jwt';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export const loginWithGoogle = async () => {
  await signIn("google")
};

export const logout = async () => {
  //await deleteSession()
  await signOut({ redirectTo: "/i/dashboard" });
};

type ResetPasswordFucn = (
  jwtUserId: string,
  password: string
) => Promise<"userNotExist" | "success">;

export const resetPassword: ResetPasswordFucn = async (jwtUserId, password) => {
  const payload = verifyJwt(jwtUserId);
  if (!payload) return "userNotExist";
  const userId = payload.id;

  const user = await prisma.user.findUnique({
    where:{
      id:userId
    }, 
  });

  if (!user) return "userNotExist";

  const result = await prisma.user.update(
    {
      where:{
        id:userId
    },
      data:{
        password: await bcrypt.hash(password, 10),
      }
  }
     
  );

  if (result) return "success";
  else throw new Error("Something went wrong!");
};
