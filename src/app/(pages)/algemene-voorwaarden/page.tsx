import Header from "@/components/navigation/header";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { FileText } from "lucide-react";
import React from "react";

const TermsAndConditionsPage = () => {
  const storeName = "Lazo Spirits Den Haag"
  return (
    <>
      {/* Header */}
      <div className="bg-hero-light dark:bg-hero-dark">
        <Header />
      </div>
      <Section variant="default" spacing="lg">
        <div className="max-w-5xl mx-auto text-text-secondary text-center md:text-left">
          <SectionHeader
            badge="Voorwaarden"
            badgeIcon={<FileText className="h-4 w-4" />}
            title="Algemene Voorwaarden"
            description="Lees onze algemene voorwaarden"
          />
      <section>
        <p>
          Welkom bij {storeName}. Deze Algemene Voorwaarden zijn van toepassing op alle aankopen en diensten aangeboden via onze website: 
          {" " + process.env.NEXT_PUBLIC_BASE_URL}. Door gebruik te maken van onze website, ga je akkoord met deze voorwaarden. Lees ze zorgvuldig door.
        </p>

        <h2 className="mt-5 text-xl font-semibold">1. Producten en Diensten</h2>
        <p>
          Wij bieden via onze website diverse alcoholische dranken aan. Alle producten zijn onderhevig aan beschikbaarheid en kunnen worden
          gewijzigd.
        </p>

        <h2 className="mt-5 text-xl font-semibold">2. Leeftijdsrestrictie</h2>
        <p>
          Je moet minimaal 18 jaar oud zijn om alcoholische dranken bij ons te bestellen. Door een bestelling te plaatsen, bevestig je dat je aan
          deze leeftijdseis voldoet.
        </p>

        <h2 className="mt-5 text-xl font-semibold">3. Bestelproces</h2>
        <p>
          Na het plaatsen van je bestelling ontvang je een bevestiging per e-mail met de details van je bestelling. De bestelling kan vervolgens
          opgehaald worden.
        </p>

        <h2 className="mt-5 text-xl font-semibold">4. Prijzen en Betaling</h2>
        <p>Alle prijzen op onze website zijn exclusief BTW. Betaling geschiedt veilig via de door ons aangeboden betaalmethoden op de website. Op dit moment alleen vooraf overmaken of bij het afhalen. </p>

        <h2 className="mt-5 text-xl font-semibold">5. Annulering en Retourbeleid</h2>
        <p>
          Je hebt het recht je bestelling tot 14 dagen na ontvangst te retourneren mits deze onaangebroken zijn.
        </p>

        <h2 className="mt-5 text-xl font-semibold">6. Aansprakelijkheid</h2>
        <p>Wij zijn niet aansprakelijk voor schade die ontstaat door verkeerd gebruik van de gekochte producten.</p>

        <h2 className="mt-5 text-xl font-semibold">7. Intellectueel Eigendom</h2>
        <p>
          De inhoud van onze website, inclusief teksten, grafieken, logos, en beeldmateriaal, is eigendom van {storeName} en is beschermd door
          intellectueel eigendomsrecht.
        </p>

        <h2 className="mt-5 text-xl font-semibold">8. Wijzigingen in de Voorwaarden</h2>
        <p>Deze voorwaarden kunnen van tijd tot tijd worden aangepast. Wij raden je aan deze regelmatig te raadplegen.</p>

        <h2 className="mt-5 text-xl font-semibold">9. Contact</h2>
        <p>Voor vragen over deze voorwaarden kun je contact met ons opnemen via {process.env.COMPANY_EMAIL}.</p>
      </section>
        </div>
      </Section>
    </>
  );
};

export default TermsAndConditionsPage;
