"use client";
import { requestPasswordReset } from "@/actions/users/user.actions";
import { Icons } from "@/components/icons";
import { resetPasswordRequestSchema } from "@/lib/types/resetPasswordRequest";
import { navigateTo } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "../../button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../../input";

const ResetPasswordForm = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

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
      <h1 className="my-10 text-center text-3xl font-bold sm:mb-0"> Password reset aanvragen </h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto mt-2 flex max-w-96 flex-col justify-center space-y-4 sm:min-h-72">
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
        {/* <Button onClick={handleSubmit}>Reset Password</Button> */}
        <Button variant="outline" type="submit" disabled={isLoading}>
          {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.logo className="mr-2 h-4 w-4" />}
          Opslaan
        </Button>
      </form>
    </Form>

    //     <div className="mx-auto flex max-w-7xl flex-col gap-4">
    //   <h1>Reset Password</h1>
    //   <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
    //   <p>{message}</p>
    // </div>
  );
};

export default ResetPasswordForm;
