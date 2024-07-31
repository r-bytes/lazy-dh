"use client";
import { useState } from "react";

import { changePassword } from "@/actions/users/user.actions";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPasswordSchema } from "@/lib/types/resetPassword";
import { navigateTo } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

interface ChangePasswordFormProps {
  resetPasswordToken: string;
}

const ChangePasswordForm = ({ resetPasswordToken }: ChangePasswordFormProps) => {
  // const [password, setPassword] = useState<string>("");
  // const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<string>("");

  const router = useRouter();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSuccess = (message: string) => {
    toast.success(message);
    navigateTo(router, "/account/reset-password/succes");
    setMessage(message);
    setIsLoading(false);
  };

  const handleFailure = (error: string) => {
    toast.error(error);
    setMessage(error);
    setIsLoading(false);
  };

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    setIsLoading(true);

    const { password, confirmPassword } = values;

    if (password !== confirmPassword) {
      setMessage("Wachtwoorden komen niet overeen");
      toast.error("Wachtwoorden komen niet overeen");

      return;
    }

    const passwordResetResponse = await changePassword(resetPasswordToken, password);
    setMessage(passwordResetResponse.message);

    if (passwordResetResponse.success) {
      handleSuccess(passwordResetResponse.message)
    } else {
      handleFailure(passwordResetResponse.message);
    }
  };

  return (
    <Form {...form}>
      <h1 className="my-10 text-center text-3xl font-bold sm:mb-0"> Wachtwoord wijzigen </h1>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto mt-2 flex max-w-96 flex-col justify-center space-y-4"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem className="mx-4">
              <FormControl>
                <div className="relative">
                  <Input placeholder="Wachtwoord" type={showPassword ? "text" : "password"} {...field} />
                  <Button
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <FormItem className="mx-4">
              <FormControl>
                <div className="relative">
                  <Input placeholder="Herhaal wachtwoord" type={showConfirmPassword ? "text" : "password"} {...field} />
                  <Button
                    style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </FormControl>
              {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
            </FormItem>
          )}
        />
        <Button variant="outline" type="submit" disabled={isLoading} className="mx-4">
          {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.logo className="mr-2 h-4 w-4" />}
          Opslaan
        </Button>
      </form>
    </Form>
  );
};

export default ChangePasswordForm;
