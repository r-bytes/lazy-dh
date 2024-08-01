import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const companyInfo = {
  Naam: "Lazo Spirits Den Haag",
  Adres: "adres",
  Telefoonnummer: "123",
  "IBAN-nummer": "123",
  "KVK-nummer: ": "123",
  "BTW-identificatienummer: ": "123",
};

const AboutPage = () => {
  return (
    <MaxWidthWrapper className="mx-auto w-full">
      <div className="w-full p-10">
        <h1 className="ml-2 text-center font-semibold text-muted-foreground text-3xl">Over ons</h1>
        <h4 className="my-4 ml-3 text-center text-sm font-light text-muted-foreground">Bedrijfsgegevens</h4>

        <Table className="my-10 w-full min-w-fit">
          <TableBody>
            {/* Iterating over the companyInfo object keys to create a row for each entry */}
            {Object.entries(companyInfo).map(([key, value]) => (
              <TableRow key={key} className="flex flex-row justify-between">
                <TableCell className="font-semibold">{key.replace(/([a-z])([A-Z])/g, "$1 $2")}</TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </MaxWidthWrapper>
  );
};

export default AboutPage;
