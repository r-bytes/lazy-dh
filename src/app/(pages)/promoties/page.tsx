import Header from "@/components/navigation/header";
import Promotions from "@/components/products/products-list-sale";

export default async function Page() {
  return (
    <>
      {/* Header */}
      <div className="bg-hero-light dark:bg-hero-dark">
        <Header />
      </div>
      <Promotions isPromo={true} />
    </>
  );
}
