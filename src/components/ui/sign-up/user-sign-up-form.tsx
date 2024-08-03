"use client";

import { signUp } from "@/actions/users/user.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/lib/types/signup";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../accordion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../card";
import { navigateTo } from "@/lib/utils";
import { Icons } from "@/components/icons";

export function UserSignUpForm({ fromCheckout = false }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
  } = useForm<z.infer<typeof signUpSchema>>({
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

    useEffect(() => {
      const subscription = watch((value, { name, type }) => {
        if (type === "change" && errors[name!]) {
          clearErrors(name);
        }
      });
      return () => subscription.unsubscribe();
    }, [watch, clearErrors, errors]);

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    setIsLoading(true);
    try {
      const response = await signUp(values);
      if (response.success) {
        toast.success("Succesvol geregistreerd");
        navigateTo(router, "/account/registreer/succes");
      } else {
        const errorKeys = Object.keys(errors) as Array<keyof z.infer<typeof signUpSchema>>;
        setExpanded(errorKeys);
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Fout bij registreren, probeer later nog eens");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto my-8 p-4 shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="ml-3">
          <CardTitle className="text-left md:text-center"> Nieuwe klant </CardTitle>
          <CardDescription className="text-left md:text-center"> Vul het formulier in om een nieuw account te maken </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={["item-1", "item-2", "item-3"]} className="w-full px-2">
            <AccordionItem value="item-1">
              <AccordionTrigger className="m-3"> Persoonsgegevens </AccordionTrigger>
              <AccordionContent className="my-2 flex flex-col space-y-4">
                <div className={fromCheckout ? "relative mx-2" : "relative"}>
                  <Input id="name" placeholder="Name" {...register("name")} />
                  <span style={{ position: "absolute", right: 15, top: "50%", transform: "translateY(-50%)" }} className="text-lg text-red-500">
                    *
                  </span>
                </div>
                <div className={fromCheckout ? "relative mx-2" : "relative"}>
                  <Input id="email" placeholder="Email" {...register("email")} />
                  <span style={{ position: "absolute", right: 15, top: "50%", transform: "translateY(-50%)" }} className="text-lg text-red-500">
                    *
                  </span>
                </div>
                <div className={fromCheckout ? "relative mx-2" : "relative"}>
                  <Input id="address" placeholder="Adres" {...register("address")} />
                  <span style={{ position: "absolute", right: 15, top: "50%", transform: "translateY(-50%)" }} className="text-lg text-red-500">
                    *
                  </span>
                </div>

                <div className={fromCheckout ? "relative mx-2" : "relative"}>
                  <Input id="postal" placeholder="Postcode" {...register("postal")} />
                  <span style={{ position: "absolute", right: 15, top: "50%", transform: "translateY(-50%)" }} className="text-lg text-red-500">
                    *
                  </span>
                </div>

                <div className={fromCheckout ? "relative mx-2" : "relative"}>
                  <Input id="city" placeholder="Stad" {...register("city")} />
                  <span style={{ position: "absolute", right: 15, top: "50%", transform: "translateY(-50%)" }} className="text-lg text-red-500">
                    *
                  </span>
                </div>

                <div className={fromCheckout ? "relative mx-2" : "relative"}>
                  <Input id="phoneNumber" placeholder="Telefoonnummer" {...register("phoneNumber")} />
                  <span style={{ position: "absolute", right: 15, top: "50%", transform: "translateY(-50%)" }} className="text-lg text-red-500">
                    *
                  </span>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="m-3"> Bedrijfsgegevens </AccordionTrigger>
              <AccordionContent className="my-2 flex flex-col space-y-4">
                <div className={fromCheckout ? "mx-2" : ""}>
                  <Input id="companyName" placeholder="Bedrijfsnaam" {...register("companyName")} />
                </div>
                <div className={fromCheckout ? "mx-2" : ""}>
                  <Input id="vatNumber" placeholder="BTW-nummer" {...register("vatNumber")} />
                </div>
                <div className={fromCheckout ? "mx-2" : ""}>
                  <Input id="chamberOfCommerceNumber" placeholder="KVK-nummer" {...register("chamberOfCommerceNumber")} />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionItem value="password">
                <AccordionTrigger className="m-3"> Wachtwoord </AccordionTrigger>
                <AccordionContent className="my-2 flex flex-col gap-4">
                  <div className={fromCheckout ? "relative mx-2" : "relative"}>
                    <Input
                      placeholder="Wachtwoord"
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        required: "Password is required",
                      })}
                    />
                    <Button
                      type="button"
                      style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                    <span style={{ position: "absolute", right: 80, top: "50%", transform: "translateY(-50%)" }} className="text-lg text-red-500">
                      *
                    </span>
                  </div>

                  <div className={fromCheckout ? "relative mx-2" : "relative"}>
                    <Input
                      placeholder="Herhaal wachtwoord"
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword", {
                        required: "Confirm password is required",
                      })}
                    />
                    <Button
                      type="button"
                      style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </Button>
                    <span style={{ position: "absolute", right: 80, top: "50%", transform: "translateY(-50%)" }} className="text-lg text-red-500">
                      *
                    </span>
                  </div>
                </AccordionContent>
              </AccordionItem>
              {errors.name && <p className="m-4 text-red-500">{errors.name.message}</p>}
              {errors.email && <p className="m-4 text-red-500">{errors.email.message}</p>}
              {errors.address && <p className="m-4 text-red-500">{errors.address.message}</p>}
              {errors.postal && <p className="m-4 text-red-500">{errors.postal.message}</p>}
              {errors.city && <p className="m-4 text-red-500">{errors.city.message}</p>}
              {errors.phoneNumber && <p className="m-4 text-red-500">{errors.phoneNumber.message}</p>}
              {errors.email && <p className="m-4 text-red-500">{errors.email.message}</p>}
              {errors.companyName && <p className="m-4 text-red-500">{errors.companyName.message}</p>}
              {errors.vatNumber && <p className="m-4 text-red-500">{errors.vatNumber.message}</p>}
              {errors.chamberOfCommerceNumber && <p className="m-4 text-red-500">{errors.chamberOfCommerceNumber.message}</p>}
              {errors.email && <p className="m-4 text-red-500">{errors.email.message}</p>}
              {errors.password && <p className="m-4 text-red-500">{errors.password.message}</p>}
              {errors.confirmPassword && <p className="m-4 text-red-500">{errors.confirmPassword.message}</p>}
            </AccordionItem>
          </Accordion>
          {/* Checkbox for terms and conditions */}
          <div className="mt-4 ml-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <span className="ml-2 text-muted-foreground">
                Ik accepteer de
                <a href="/algemene-voorwaarden" className="ml-2 text-primary underline">
                  algemene voorwaarden
                </a>
              </span>
            </label>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-3" type="submit" disabled={isLoading || !termsAccepted}>
            {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : "Registeer"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
