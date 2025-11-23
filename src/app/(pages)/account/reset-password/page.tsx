import Header from "@/components/navigation/header";
import ChangePasswordForm from "@/components/ui/account/reset-password/change-password-form";
import ResetPasswordForm from "@/components/ui/account/reset-password/reset-password-form";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

interface ResetPasswordPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const ResetPasswordPage = async ({ searchParams }: ResetPasswordPageProps) => {
  let user = null;
  if (searchParams.token) {
    user = await db.query.users.findFirst({
      where: eq(users.resetPasswordToken, searchParams.token as string),
    });
  }

  return (
    <>
      {/* Header */}
      <div className="bg-hero-light dark:bg-hero-dark">
        <Header />
      </div>
      <Section variant="default" spacing="lg">
        <div className="mx-auto max-w-md">
          <Card className="bg-surface p-4 shadow-lg sm:p-6">
            {searchParams.token ? (
              <>
                {!user ? (
                  <div className="text-center text-destructive">Invalid token</div>
                ) : (
                  <ChangePasswordForm resetPasswordToken={searchParams.token as string} />
                )}
              </>
            ) : (
              <ResetPasswordForm />
            )}
          </Card>
        </div>
      </Section>
    </>
  );
};

export default ResetPasswordPage;
