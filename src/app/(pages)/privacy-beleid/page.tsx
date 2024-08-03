import React from "react";

type Props = {};

const PrivacyPage = (props: Props) => {
  const storeName = "Lazo Spirits Den Haag"
  return (
    <div className="mx-auto max-w-5xl px-20 py-8 text-center text-muted-foreground md:text-left">
      <h1 className="mb-6 text-center md:text-left text-3xl font-bold">Gebruiksvoorwaarden en Privacybeleid</h1>

      {/* Gebruiksvoorwaarden Sectie */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Gebruiksvoorwaarden</h2>
        <p>
          Welkom op de website van {storeName}. Door deze website te gebruiken, ga je akkoord met de volgende gebruiksvoorwaarden. Lees deze
          voorwaarden zorgvuldig door voordat je onze diensten gebruikt.
        </p>
        <h3 className="mt-4 font-semibold">Toegang en Gebruik</h3>
        <p>
          Je dient minimaal 18 jaar oud te zijn om alcoholische dranken te kopen. Door een bestelling te plaatsen, bevestig je dat je aan deze
          leeftijdsvereiste voldoet. Het is jouw verantwoordelijkheid om ervoor te zorgen dat alle informatie die je verstrekt tijdens het
          bestelproces correct en volledig is.
        </p>
        <h3 className="mt-4 font-semibold">Intellectueel Eigendom</h3>
        <p>
          Alle inhoud op deze website, inclusief tekst, grafische voorstellingen, logos en afbeeldingen, is eigendom van {storeName} of onze
          contentleveranciers en wordt beschermd door nationale en internationale auteursrechtwetten.
        </p>
        <h3 className="mt-4 font-semibold">Beperking van Aansprakelijkheid</h3>
        <p>
          {storeName} is niet aansprakelijk voor enige directe, indirecte, incidentele, speciale of gevolgschade die voortkomt uit het gebruik van
          of de onmogelijkheid om deze website te gebruiken.
        </p>
        <h3 className="mt-4 font-semibold">Wijzigingen in de Voorwaarden</h3>
        <p>
          Wij behouden ons het recht voor om deze voorwaarden op elk moment te wijzigen. Wijzigingen worden van kracht zodra ze op deze website zijn
          gepubliceerd.
        </p>
      </section>

      {/* Privacybeleid Sectie */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Privacybeleid</h2>
        <h3 className="mt-4 font-semibold">Informatieverzameling en Gebruik</h3>
        <p>
          Wij verzamelen persoonlijke informatie zoals je naam, adres, telefoonnummer en e-mailadres wanneer je een bestelling plaatst. Deze
          informatie wordt gebruikt om je bestelling te verwerken en te leveren, en om je service-updates te sturen.
        </p>
        <h3 className="mt-4 font-semibold">Gegevensbescherming</h3>
        <p>
          We nemen de bescherming van je persoonlijke gegevens serieus en treffen passende fysieke, elektronische en administratieve maatregelen om
          je gegevens te beveiligen tegen verlies, diefstal en misbruik, alsmede tegen ongeautoriseerde toegang, openbaarmaking, wijziging en
          vernietiging.
        </p>
        <h3 className="mt-4 font-semibold">Delen van Informatie</h3>
        <p>
          Je persoonlijke gegevens worden niet verkocht, verhandeld, of anderszins overgedragen aan buitenstaanders, behalve aan vertrouwde derde
          partijen die ons helpen bij het uitvoeren van onze website, het leiden van onze zaken of het bedienen van onze gebruikers, zolang deze
          partijen ermee instemmen deze informatie vertrouwelijk te houden.
        </p>
        <h3 className="mt-4 font-semibold">Toestemming</h3>
        <p>Door gebruik te maken van onze site, stem je in met ons privacybeleid.</p>
      </section>
    </div>
  );
};

export default PrivacyPage;
