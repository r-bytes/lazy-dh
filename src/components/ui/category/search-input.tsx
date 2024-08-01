"use client";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useProductContext } from "@/context/ProductContext";
import Product from "@/lib/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  productName: z.string().min(2, {
    message: "Product naam moet uit minstens 2 karakter bestaan.",
  }),
});

type InputFormProps = {
  products: Product[];
  onSearchChange: (products: Product[]) => void;
};

export function InputForm({ products, onSearchChange }: InputFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      productName: "",
    },
  });

  const { register, handleSubmit, setValue, watch } = form;
  const watchedValue = watch("productName");
  const { isSearching, setIsSearching } = useProductContext();

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

  useEffect(() => {
    if (form.watch("productName")) {
      const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(form.watch("productName").toLowerCase()));
      onSearchChange(filteredProducts);
    } else {
      onSearchChange(products); // Reset to original products if search input is cleared
    }
  }, [products, onSearchChange, form]);

  useEffect(() => {
    if (!form.getValues("productName")) {
      form.reset({ productName: "" });
    }
  }, [form]);

  useEffect(() => {
    // Update isSearching based on whether the input is empty or not
    setIsSearching(!!watchedValue);
  }, [watchedValue, setIsSearching]);

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
