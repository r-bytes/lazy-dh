"use client";

import { signUp } from "@/actions/user.actions";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/lib/types/signup";
import { navigateTo } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

export function UserSignUpForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSuccess = () => {
    toast.success("successvol geregistreerd!");
    navigateTo(router, "/");
    setIsLoading(false);
  };

  const handleFailure = (error: any) => {
    toast.error(error);
    setIsLoading(false);
  };

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    setIsLoading(true);
    const signUpResponse = await signUp(values);

    if (signUpResponse) {
      signUpResponse.success ? handleSuccess() : signUpResponse.message ? handleFailure(signUpResponse.message) : null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Confirm Password </FormLabel>
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
