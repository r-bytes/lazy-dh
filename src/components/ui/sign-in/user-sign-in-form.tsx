"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/lib/types/signin";
import { navigateTo } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../card";

export function UserSignInForm({ fromCheckout }: { fromCheckout?: boolean }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminApproved, setIsAdminApproved] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const checkAdminApproval = async (email: string) => {
    if (email) {
      try {
        const response = await fetch("/api/getUserApprovalStatus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email }),
        });
        const data = await response.json();

        return data;
      } catch (error) {
        console.error("Failed to fetch admin approval status:", error);
        setIsAdminApproved(false);
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    setIsLoading(true);

    // Convert email to lowercase before proceeding
    const lowerCaseEmail = values.email.toLowerCase();

    const adminApprovalResponse = await checkAdminApproval(values.email);
    const { success, message } = await adminApprovalResponse;

    if (!success && message === "Account wacht op goedkeuring van admin") {
      toast.error(message);
      setIsLoading(false);
      return;
    } else if (success && message === "Account is goedgekeurd") {
      const result = await signIn("credentials", {
        redirect: false, // Prevents redirecting to signIn's callback URL
        email: lowerCaseEmail,
        password: values.password,
      });

      if (result?.error) {
        toast.error("Inloggen mislukt");
      } else {
        toast.success("Succesvol ingelogd");
        navigateTo(router, `${fromCheckout ? "/winkelwagen" : "/"}`);
      }

      setIsLoading(false);
      return;
    }

    toast.error(message);
    return;
  };

  return fromCheckout ? (
    <Form {...form}>
      <Card className="mx-[-1rem] py-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 max-w-96 space-y-4 md:max-w-full">
          <CardHeader>
            <CardTitle className="text-left md:text-center"> Bestaande klant </CardTitle>
            <CardDescription className="text-left md:text-center"> Log in met je account gegevens </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="Wachtwoord" type={showPassword ? "text" : "password"} {...field} />
                      <Button
                        type="reset"
                        style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                  </FormControl>
                  {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button variant="outline" type="submit" disabled={isLoading}>
              {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.logo className="mr-2 h-4 w-4" />}
              Inloggen
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Form>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 max-w-96 space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input placeholder="Wachtwoord" type={showPassword ? "text" : "password"} {...field} />
                  <Button
                    type="reset"
                    style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </FormControl>
              {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
            </FormItem>
          )}
        />
        <Button variant="outline" type="submit" disabled={isLoading}>
          {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.logo className="mr-2 h-4 w-4" />}
          Inloggen
        </Button>
      </form>
    </Form>
  );
}
