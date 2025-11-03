"use client";

import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import withAuth from "@/hoc/withAuth";
import DashboardContent from "./dashboard-content";

const DashboardPage = () => {
  return (
    <MaxWidthWrapper className="mx-auto flex flex-col md:px-8">
      <DashboardContent />
    </MaxWidthWrapper>
  );
};

export default withAuth(DashboardPage);
