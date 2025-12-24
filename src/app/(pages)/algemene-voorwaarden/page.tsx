import Header from "@/components/navigation/header";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = generateSEOMetadata({
  title: "Algemene Voorwaarden",
  description: "Lees onze algemene voorwaarden voor het gebruik van onze website en het plaatsen van bestellingen. Informatie over producten, betaling, levering en retourbeleid.",
  path: "/algemene-voorwaarden",
  keywords: ["algemene voorwaarden", "voorwaarden", "terms", "leveringsvoorwaarden", "retourbeleid"],
  noindex: true, // Terms pages typically shouldn't be indexed
});

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
          Wij bieden via onze website diverse alcoholische dranken aan. Alle producten zijn onderhevig aan beschikbaarheid. Wij behouden ons het recht voor om producten te wijzigen of uit het assortiment te verwijderen zonder voorafgaande kennisgeving.
        </p>

        <h2 className="mt-5 text-xl font-semibold">2. Leeftijdsrestrictie</h2>
        <p>
          Je moet minimaal 18 jaar oud zijn om alcoholische dranken bij ons te bestellen. Door een bestelling te plaatsen, bevestig je dat je aan deze leeftijdseis voldoet. Bij afhaling of levering kunnen wij om identificatie vragen om je leeftijd te verifiëren.
        </p>

        <h2 className="mt-5 text-xl font-semibold">3. Bestelproces en Minimale Bestelwaarde</h2>
        <p>
          Na het plaatsen van je bestelling ontvang je een bevestiging per e-mail met de details van je bestelling. De bestelling kan vervolgens opgehaald worden.
        </p>
        <p className="mt-2">
          <strong>Minimale bestelwaarde:</strong> Wij leveren alleen bestellingen met een minimale waarde van <strong>€ 1.200,00 excl. BTW</strong>. 
          Bestellingen onder dit bedrag kunnen niet worden geplaatst.
        </p>

        <h2 className="mt-5 text-xl font-semibold">4. Prijzen en Betaling</h2>
        <p>
          Alle prijzen op onze website zijn exclusief BTW. Betaling geschiedt vooraf via overboeking of bij het afhalen. 
          Wij behouden ons het recht voor om prijzen te wijzigen zonder voorafgaande kennisgeving, hoewel wijzigingen geen invloed hebben op reeds geplaatste bestellingen.
        </p>

        <h2 className="mt-5 text-xl font-semibold">5. Herroepingsrecht en Retourbeleid</h2>
        <p>
          Volgens de Nederlandse wetgeving heb je als consument het recht om een koop op afstand binnen 14 dagen na ontvangst van het product te herroepen (herroepingsrecht).
        </p>
        <p className="mt-2">
          <strong>Uitzondering voor alcoholische dranken:</strong> Het herroepingsrecht geldt <strong>niet</strong> voor alcoholische dranken waarvan de verzegeling is verbroken of die zijn geopend. 
          Ongeopende en verzegelde producten kunnen binnen 14 dagen na ontvangst worden geretourneerd, mits ze in originele staat en verpakking zijn.
        </p>
        <p className="mt-2">
          Voor het uitoefenen van je herroepingsrecht, neem contact met ons op via {process.env.COMPANY_EMAIL}. 
          De retourkosten zijn voor eigen rekening, tenzij het product beschadigd of verkeerd is geleverd.
        </p>

        <h2 className="mt-5 text-xl font-semibold">6. Beschadigde of Verkeerde Leveringen</h2>
        <p>
          Als je een beschadigd of verkeerd product ontvangt, dien je dit binnen 48 uur na ontvangst te melden via {process.env.COMPANY_EMAIL}. 
          Wij zullen het probleem zo spoedig mogelijk oplossen door middel van vervanging of volledige terugbetaling.
        </p>

        <h2 className="mt-5 text-xl font-semibold">7. Statiegeld</h2>
        <p>
          Op bepaalde verpakkingen (zoals plastic flessen en blikjes) kan statiegeld van toepassing zijn. 
          Het statiegeld wordt op de factuur vermeld en kan worden terugbetaald bij het retourneren van de lege verpakkingen in goede staat.
        </p>

        <h2 className="mt-5 text-xl font-semibold">8. Aansprakelijkheid</h2>
        <p>
          Wij zijn aansprakelijk voor schade die direct het gevolg is van een tekortkoming in de nakoming van onze verplichtingen, voor zover deze schade redelijkerwijs voorzienbaar was. 
          Wij zijn niet aansprakelijk voor schade die ontstaat door verkeerd gebruik van de gekochte producten of schade die het gevolg is van omstandigheden buiten onze redelijke controle.
        </p>

        <h2 className="mt-5 text-xl font-semibold">9. Intellectueel Eigendom</h2>
        <p>
          De inhoud van onze website, inclusief teksten, grafieken, logos, en beeldmateriaal, is eigendom van {storeName} en is beschermd door intellectueel eigendomsrecht. 
          Zonder voorafgaande schriftelijke toestemming is het niet toegestaan om deze content te kopiëren, te reproduceren of te gebruiken.
        </p>

        <h2 className="mt-5 text-xl font-semibold">10. Wijzigingen in de Voorwaarden</h2>
        <p>
          Deze voorwaarden kunnen van tijd tot tijd worden aangepast. Wijzigingen treden in werking na publicatie op deze pagina. 
          Wij raden je aan deze regelmatig te raadplegen. Bestellingen die zijn geplaatst vóór een wijziging vallen onder de voorwaarden die op dat moment van kracht waren.
        </p>

        <h2 className="mt-5 text-xl font-semibold">11. Toepasselijk Recht en Geschillen</h2>
        <p>
          Op deze voorwaarden en alle overeenkomsten tussen jou en {storeName} is Nederlands recht van toepassing. 
          Geschillen zullen worden voorgelegd aan de bevoegde rechter in Nederland.
        </p>

        <h2 className="mt-5 text-xl font-semibold">12. Contact</h2>
        <p>
          Voor vragen over deze voorwaarden of klachten kun je contact met ons opnemen via {process.env.COMPANY_EMAIL}.
        </p>
      </section>
        </div>
      </Section>
    </>
  );
};

export default TermsAndConditionsPage;
