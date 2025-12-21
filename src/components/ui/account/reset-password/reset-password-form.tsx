"use client";
import { requestPasswordReset } from "@/actions/users/user.actions";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPasswordRequestSchema } from "@/lib/types/resetPasswordRequest";
import { navigateTo } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const ResetPasswordForm = () => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const router = useRouter();
  const { data: session, status } = useSession();

  const form = useForm<z.infer<typeof resetPasswordRequestSchema>>({
    resolver: zodResolver(resetPasswordRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof resetPasswordRequestSchema>) => {
    setIsLoading(true);
    const { email } = values;

    await requestPasswordReset(values.email);

    const resetPasswordTokenResponse = await fetch("/api/getResetPasswordToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });

    const { resetPasswordToken } = await resetPasswordTokenResponse.json();

    const response = await fetch("/api/sendPasswordResetEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, resetPasswordToken: resetPasswordToken }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      handleFailure(message);
      setMessage(error);
    } else {
      const { message } = await response.json();
      handleSuccess(message);
      setMessage(message);
    }

    setIsLoading(false);
  };

  const handleSuccess = (message: string) => {
    toast.success(message);
    navigateTo(router, "/");
    setIsLoading(false);
  };

  const handleFailure = (error: string) => {
    toast.error(error);
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <CardHeader>
        <CardTitle className="text-left md:text-center text-text-primary">Wachtwoord reset aanvragen</CardTitle>
        <CardDescription className="text-left md:text-center text-text-secondary">
          Vul je emailadres in om een reset link te ontvangen
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-accent-yellow text-text-primary hover:bg-accent-yellow-dark"
          >
            {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.logo className="mr-2 h-4 w-4" />}
            Verstuur reset link
          </Button>
        </form>
      </CardContent>
    </Form>
  );
};

export default ResetPasswordForm;
