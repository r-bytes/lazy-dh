import ProductList from "@/components/products/product-list";
import { ProductsWithFilter } from "@/components/ui/category/products-with-filter";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import Title from "@/components/ui/title";
import { fetchProductsNoStore } from "@/lib/sanity/fetchProductsNoStore";
import { Product } from "@/lib/types/product";
import { capitalizeFirstLetter } from "@/lib/utils";

type Props = {
  params: { slug: string };
};

async function getProducts(): Promise<Product[] | null> {
  try {
    const products = await fetchProductsNoStore("");
    if (!products || products.length === 0) {
      console.error("No products fetched");
      return null;
    }
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
}

export default async function Page({ params: { slug } }: Props) {
  const products = await getProducts();

  if (!products) {
    return <div>Error loading products</div>;
  }

  const filteredProducts = products.filter(product => {    
    if (slug === "nieuw") {
      return product.isNew;
    } else if (slug === "aanbiedingen") {
      return product.inSale;
    } else if (slug.toLowerCase() === product.category.toLowerCase()) {
      return true;
    }
    return false;
  });

  if (slug === "alles") {
    console.log("Rendering ProductsWithFilter");
    return (
      <MaxWidthWrapper className="mx-auto">
        <ProductsWithFilter products={products} />
      </MaxWidthWrapper>
    );
  } else {
    return (
      <div className="flex h-full flex-col">
        <Title name={capitalizeFirstLetter(slug)} />
        <ProductList products={filteredProducts} />
      </div>
    );
  }
}
