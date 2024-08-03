import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Title from "@/components/ui/title";

const companyInfo = {
  "Naam": process.env.COMPANY_NAME!,
  "Adres": `${process.env.COMPANY_ADDRESS!}, ${process.env.COMPANY_POSTAL!}, ${process.env.COMPANY_CITY!}`,
  "Telefoonnummer": process.env.COMPANY_PHONE!,
  "IBAN-nummer": process.env.COMPANY_IBAN!,
  "KVK-nummer: ": process.env.COMPANY_KVK_NUMBER!,
  "BTW-identificatienummer: ": process.env.COMPANY_VAT_NUMBER!,
};

const AboutPage = () => {
  return (
    <MaxWidthWrapper className="mx-auto w-full">
      <div className="w-full p-10">
        <Title name="Over ons"/>
        <h4 className="my-4 ml-3 text-center text-base font-light text-muted-foreground">Bedrijfsgegevens</h4>

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
