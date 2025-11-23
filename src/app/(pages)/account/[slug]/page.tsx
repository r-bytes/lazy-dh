import Header from "@/components/navigation/header";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import Title from "@/components/ui/title";
import { capitalizeFirstLetter } from "@/lib/utils";

type Props = {
  params: { slug: string };
};

const page = ({ params: { slug } }: Props) => {
  return (
    <>
      {/* Header */}
      <div className="bg-hero-light dark:bg-hero-dark">
        <Header />
      </div>
      <Section variant="default" spacing="lg">
        {slug === "bestellingen" ? (
          <div className="flex w-full flex-col items-center justify-center py-12 text-center">
            <p className="text-lg text-text-secondary">Bestellingen pagina</p>
          </div>
        ) : slug === "wachtwoord-reset" ? (
          <div className="flex w-full flex-col items-center justify-center py-12 text-center">
            <p className="text-lg text-text-secondary">Wachtwoord reset pagina</p>
          </div>
        ) : (
          <div className="flex w-full flex-col">
            <SectionHeader
              title={capitalizeFirstLetter(slug)}
              description=""
            />
          </div>
        )}
      </Section>
    </>
  );
};
export default page;
