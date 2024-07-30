"use client";

import { signUp } from "@/actions/users/user.actions";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "../accordion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../card";

export function UserSignUpForm({ fromCheckout }: { fromCheckout?: boolean }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      postal: "",
      city: "",
      phoneNumber: "",
      companyName: "",
      vatNumber: "",
      chamberOfCommerceNumber: "",
      password: "",
      confirmPassword: "",
      emailVerified: false,
    },
  });

  const handleSuccess = () => {
    toast.success("Succesvol geregistreerd!");
    router.push("/account/registreer/succes"); // Using Next.js router to navigate
    setIsLoading(false);
  };

  const handleFailure = (message: string) => {
    // Provide a default error message if none is provided
    toast.error(message || "Registratie mislukt. Probeer het alstublieft opnieuw.");
    setIsLoading(false);
  };

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    setIsLoading(true);
    try {
      const signUpResponse = await signUp(values);

      if (signUpResponse) {
        if (signUpResponse.success) {
          handleSuccess();
        } else {
          // Call handleFailure with a specific message or a generic one
          handleFailure(signUpResponse.message || "Onbekende fout bij registratie.");
        }
      } else {
        // Handle cases where signUpResponse might be undefined or null
        handleFailure("Geen respons van server.");
      }
    } catch (error) {
      // This catch block handles unexpected errors such as network issues
      console.error("Registration error:", error);
      handleFailure("Netwerkfout of server niet bereikbaar.");
    }
    setIsLoading(false); // Ensure loading is always turned off after operation completes
  };

  return (
    <Form {...form}>
      <Card className="mx-[-1rem] py-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 max-w-96 space-y-4 md:max-w-full">
          <CardHeader>
            <CardTitle className="text-left md:text-center"> Registreren </CardTitle>
            <CardDescription className="text-left md:text-center"> Nieuw account registreren </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Accordion type="single" collapsible className="w-full px-2">
              <AccordionItem value="item-1">
                {/* <FormLabel className="m-3"> Persoonsgegevens </FormLabel> */}
                <AccordionTrigger className="m-3"> Persoonsgegevens </AccordionTrigger>
                <AccordionContent className="my-2 flex flex-col space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <FormItem className={fromCheckout ? "mx-2" : ""}>
                        <FormControl>
                          <Input placeholder="Naam" {...field} />
                        </FormControl>
                        {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                      </FormItem>
                    )}
                  />
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
                    name="address"
                    render={({ field, fieldState }) => (
                      <FormItem className={fromCheckout ? "mx-2" : ""}>
                        <FormControl>
                          <Input placeholder="Adres" {...field} />
                        </FormControl>
                        {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postal"
                    render={({ field, fieldState }) => (
                      <FormItem className={fromCheckout ? "mx-2" : ""}>
                        <FormControl>
                          <Input placeholder="Postcode" {...field} />
                        </FormControl>
                        {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field, fieldState }) => (
                      <FormItem className={fromCheckout ? "mx-2" : ""}>
                        <FormControl>
                          <Input placeholder="Stad" {...field} />
                        </FormControl>
                        {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field, fieldState }) => (
                      <FormItem className={fromCheckout ? "mx-2" : ""}>
                        <FormControl>
                          <Input placeholder="Telefoonnummer" {...field} />
                        </FormControl>
                        {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="m-3"> Bedrijfsgegevens </AccordionTrigger>
                <AccordionContent className="my-2 flex flex-col space-y-4">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field, fieldState }) => (
                      <FormItem className={fromCheckout ? "mx-2" : ""}>
                        <FormControl>
                          <Input placeholder="Bedrijfsnaam" {...field} />
                        </FormControl>
                        {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vatNumber"
                    render={({ field, fieldState }) => (
                      <FormItem className={fromCheckout ? "mx-2" : ""}>
                        <FormControl>
                          <Input placeholder="BTW-nummer" {...field} />
                        </FormControl>
                        {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="chamberOfCommerceNumber"
                    render={({ field, fieldState }) => (
                      <FormItem className={fromCheckout ? "mx-2" : ""}>
                        <FormControl>
                          <Input placeholder="KVK-nummer" {...field} />
                        </FormControl>
                        {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="m-3"> Wachtwoord </AccordionTrigger>
                <AccordionContent className="my-2 flex flex-col space-y-4">
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
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
