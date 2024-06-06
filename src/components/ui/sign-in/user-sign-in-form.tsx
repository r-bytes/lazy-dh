"use client";

import { signIn, signUp } from "@/actions/auth.actions";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { navigateTo } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function UserSignInForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSuccess = () => {
    toast.success("successvol ingelogd!");
    navigateTo(router, "/");
    setIsLoading(false);
  };

  const handleFailure = (error: any) => {
    toast.error(error);
    setIsLoading(false);
  };

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    const signUpResponse = await signIn(values);

    if (signUpResponse) {
      signUpResponse.success ? handleSuccess() : signUpResponse.error ? handleFailure(signUpResponse.error) : null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Email </FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Password </FormLabel>
              <FormControl>
                <Input placeholder="*****" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="outline" type="submit" disabled={isLoading}>
          {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.logo className="mr-2 h-4 w-4" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
