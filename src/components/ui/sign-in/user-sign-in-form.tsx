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
import { useAuthContext } from "@/context/AuthContext";

export function UserSignInForm({ fromCheckout }: { fromCheckout?: boolean }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { checkAdminApproval, isAdminApproved } = useAuthContext();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    setIsLoading(true);

    await checkAdminApproval(values.email);
    console.log(isAdminApproved);
    

    if (!isAdminApproved) {
      toast.error("Account wacht op goedkeuring van admin");
      setIsLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      redirect: false, // Prevents redirecting to signIn's callback URL
      email: values.email,
      password: values.password,
    });

    if (result?.error) {
      toast.error("Inloggen mislukt");
    } else {
      toast.success("Succesvol ingelogd");
      navigateTo(router, `${fromCheckout ? "/winkelwagen" : "/"}`);
    }

    setIsLoading(false);
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
