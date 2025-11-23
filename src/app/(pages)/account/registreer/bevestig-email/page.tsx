import Header from "@/components/navigation/header";
import { verifyEmail } from "@/actions/users/user.actions";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { CheckCircle, XCircle } from "lucide-react";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

interface VerifyEmailPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const VerifyEmailPage = async ({ searchParams }: VerifyEmailPageProps) => {
  let user = null;
  if (searchParams.token) {
    user = await db.query.users.findFirst({
      where: eq(users.emailVerificationToken, searchParams.token as string),
    });

    if (user) {
      await verifyEmail(searchParams.token as string);
    }
  }

  return (
    <>
      {/* Header */}
      <div className="bg-hero-light dark:bg-hero-dark">
        <Header />
      </div>
      <Section variant="default" spacing="lg">
        <div className="mx-auto max-w-md">
          <Card className="bg-surface p-6 text-center shadow-lg sm:p-8">
            {searchParams.token ? (
              <>
                {!user ? (
                  <>
                    <div className="mb-4 flex justify-center">
                      <XCircle className="h-12 w-12 text-destructive sm:h-16 sm:w-16" />
                    </div>
                    <SectionHeader
                      title="Ongeldige Token"
                      description="De verificatie token is ongeldig of verlopen."
                    />
                  </>
                ) : (
                  <>
                    <div className="mb-4 flex justify-center">
                      <CheckCircle className="h-12 w-12 text-green-500 sm:h-16 sm:w-16" />
                    </div>
                    <SectionHeader
                      badge="Succes"
                      badgeIcon={<CheckCircle className="h-4 w-4" />}
                      title="Email Bevestigd"
                      description={`Email bevestigd voor ${user.email}!`}
                    />
                  </>
                )}
              </>
            ) : (
              <>
                <div className="mb-4 flex justify-center">
                  <XCircle className="h-12 w-12 text-destructive sm:h-16 sm:w-16" />
                </div>
                <SectionHeader
                  title="Geen Token"
                  description="Geen verificatie token gevonden."
                />
              </>
            )}
          </Card>
        </div>
      </Section>
    </>
  );
};

export default VerifyEmailPage;
