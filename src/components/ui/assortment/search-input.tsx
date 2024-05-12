"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Search } from "lucide-react";

const FormSchema = z.object({
  productName: z.string().min(2, {
    message: "Product naam moet uit minstens 2 karakter bestaan.",
  }),
});

export function InputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      productName: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "Je hebt het volgende ingetypt",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-2/3">
        <FormField
          control={form.control}
          name="productName"
          render={({ field }) => (
            <FormItem>
                <FormControl>
                  <Input placeholder="Product zoeken ..." {...field} />
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit"></button>
      </form>
    </Form>
  );
}
