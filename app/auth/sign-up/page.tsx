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
import { SignUpForm } from "@/features/auth/sign-up-form";

export default async function SignUpPage(_: PageParams) {
  return (
    <Card className="m-auto w-full max-w-md">
      <CardHeader>
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <UserIcon className="size-6 text-primary" />
        </div>
        <CardTitle className="text-center text-2xl">S'inscrire</CardTitle>
        <CardDescription className="text-center">
          Créez un compte pour accéder à Chronos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-muted-foreground text-sm">
          Déjà un compte ?{" "}
          <Link href="/auth/sign-in" className="text-primary underline">
            Se connecter
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
