import type { PageParams } from "@/types/next";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInForm } from "@/features/auth/sign-in-form";

export default async function SignInPage(_: PageParams) {
  return (
    <Card className="m-auto w-full max-w-md">
      <CardHeader>
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <UserIcon className="size-6 text-primary" />
        </div>
        <CardTitle className="text-center text-2xl">Se connecter</CardTitle>
        <CardDescription className="text-center">
          Connectez vous à votre compte pour accéder à Chronos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-muted-foreground text-sm">
          Pas encore de compte ?{" "}
          <Link href="/auth/sign-up" className="text-primary underline">
            S'inscrire
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
