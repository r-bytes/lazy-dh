"use client";

import { signUp } from "@/actions/users/user.actions";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/lib/types/signup";
import { navigateTo } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../card";

export function UserSignUpForm({ fromCheckout }: { fromCheckout?: boolean }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    toast.success("Successvol geregistreerd!");
    navigateTo(router, "/account/registreer/bevestig");
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
      <Card className="mx-[-1rem] py-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 max-w-96 md:max-w-full space-y-4">
          <CardHeader>
            <CardTitle className="text-left md:text-center"> Registreren </CardTitle>
            <CardDescription className="text-left md:text-center"> Nieuw account registreren </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem className={fromCheckout ? "mx-2" : ""}>
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
                <FormItem className={fromCheckout ? "mx-2" : ""}>
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
                <FormItem className={fromCheckout ? "mx-2" : ""}>
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
          </CardContent>
          <CardFooter>
            <Button variant="outline" type="submit" disabled={isLoading} className={fromCheckout ? "mx-2" : ""}>
              {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.logo className="mr-2 h-4 w-4" />}
              Submit
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Form>
  );
}
