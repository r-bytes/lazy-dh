import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UserSignInForm } from "@/components/ui/sign-in/user-sign-in-form";
import { UserSignUpForm } from "@/components/ui/sign-up/user-sign-up-form";

type Props = {};

const page = (props: Props) => {
  return (
    <Accordion type="single" collapsible className="mx-auto flex min-h-72 max-w-7xl flex-col justify-center sm:my-20">
      <AccordionItem value="item-1">
        <AccordionTrigger> Inloggen </AccordionTrigger>
        <AccordionContent className="mb-10">
          <UserSignInForm />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger> Account aanmaken </AccordionTrigger>
        <AccordionContent className="mb-10">
          <UserSignUpForm />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default page;
