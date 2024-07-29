import React from "react";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import OrderManagement from "../order-management";

const AdminPage = () => {
  return (
    <MaxWidthWrapper className="mx-auto">
      <OrderManagement />
    </MaxWidthWrapper>
  );
};

export default AdminPage;
