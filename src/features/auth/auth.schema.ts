import { z } from "zod";

export const signInFormSchema = z.object({
  email: z.string().email({ message: "Entrez une adresse email valide" }),
  password: z.string().min(1, { message: "Le mot de passe est requis" }),
});

export type SignInFormData = z.infer<typeof signInFormSchema>;

export enum SignInErrorCodes {
  InvalidData = "Les données fournies sont invalides",
  InvalidCredentials = "L'email ou le mot de passe est incorrect",
  UnknownError = "Une erreur inconnue est survenue",
}

export const signUpFormSchema = z
  .object({
    email: z.string().email({ message: "Entrez une adresse email valide" }),
    password: z
      .string()
      .min(8, { message: "Le mot de passe doit comporter au moins 8 caractères" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Le mot de passe doit comporter au moins 8 caractères" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpFormSchema>;

export enum SignUpErrorCodes {
  InvalidData = "Les données fournies sont invalides",
  UnknownError = "Une erreur inconnue est survenue",
}
