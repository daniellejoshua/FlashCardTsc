"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import useAuthForm from "@/hooks/useAuthForm";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { loading, error, submit } = useAuthForm();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      await submit("http://localhost:3001/api/user/login", {
        identifier,
        password,
      });
      router.push("/protected/HomePage");
      toast.success("Log in SuccessFully", { position: "top-right" });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something Went Wrong";
      toast.error(message, { position: "top-right" });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 bg-white text-black">
        <CardContent className="grid p-0 md:grid-cols-2 bg-white text-black">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your Flash Account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <Link href="/signup">Sign up</Link>
              </FieldDescription>
            </FieldGroup>{" "}
            <Field>
              <Button
                variant="default"
                className="bg-black text-white"
                type="submit"
              >
                Login
              </Button>
            </Field>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/thunder_icon_124038.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>
      </FieldDescription>
    </div>
  );
}
