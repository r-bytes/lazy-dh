"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const contactSchema = z.object({
  name: z.string().min(1, "Naam is verplicht"),
  email: z.string().email("Ongeldig e-mailadres"),
  message: z.string().min(1, "Bericht is verplicht"),
});

type ContactFormInputs = z.infer<typeof contactSchema>;

const ContactForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      await fetch("/api/contact", {
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(data),
      });

      setSuccessMessage("E-mail succesvol verzonden");
    } catch (error) {
      console.error("Er is iets misgegaan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-screen max-w-3xl border-4 p-10">
      <h1 className="mb-4 text-2xl font-bold">Contacteer ons</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Naam
          </label>
          <Input id="name" {...register("name")} className="mt-1 block w-full" />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            E-mail
          </label>
          <Input id="email" {...register("email")} className="mt-1 block w-full" />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Bericht
          </label>
          <Textarea id="message" {...register("message")} className="mt-1 block w-full" />
          {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
        </div>
        <div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Verzenden..." : "Verzend"}
          </Button>
          {successMessage && <p className="mt-1 text-sm text-green-500">{successMessage}</p>}
        </div>
      </form>
    </Card>
  );
};

export default ContactForm;
