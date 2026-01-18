"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  SignInErrorCodes,
  type SignInFormData,
  SignUpErrorCodes,
  type SignUpFormData,
  signInFormSchema,
  signUpFormSchema,
} from "./auth.schema";

export async function signInAction(formData: SignInFormData) {
  const supabase = await createSupabaseServerClient();

  const safeData = signInFormSchema.safeParse(formData);
  if (!safeData.success)
    return {
      success: false,
      error: SignInErrorCodes.InvalidData,
    };

  const { error } = await supabase.auth.signInWithPassword({
    email: safeData.data.email,
    password: safeData.data.password,
  });
  if (error?.code)
    switch (error.code) {
      case "invalid_credentials":
        return { success: false, error: SignInErrorCodes.InvalidCredentials };
      default:
        console.error("SignIn error:", error);
        return { success: false, error: SignInErrorCodes.UnknownError };
    }

  revalidatePath("/");
  redirect("/");
}

export async function signUpAction(formData: SignUpFormData) {
  const supabase = await createSupabaseServerClient();

  const safeData = signUpFormSchema.safeParse(formData);
  if (!safeData.success)
    return {
      success: false,
      error: SignUpErrorCodes.InvalidData,
    };

  const { error } = await supabase.auth.signUp({
    email: safeData.data.email,
    password: safeData.data.password,
  });
  if (error?.code)
    switch (error?.code) {
      default:
        console.error("SignUp error:", error);
        return { success: false, error: SignUpErrorCodes.UnknownError };
    }

  revalidatePath("/");
  redirect("/");
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();

  await supabase.auth.signOut();

  revalidatePath("/");
  redirect("/");
}
