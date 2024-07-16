import React from "react";
import OrderManagement from "./order-management";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";

const AdminPage = () => {
  return (
    <MaxWidthWrapper className="mx-auto">
      <OrderManagement />
    </MaxWidthWrapper>
  );
};

export default AdminPage;
