"use client";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import withAuth from "@/hoc/withAuth";
import { fetchAllOrders } from "@/lib/db/data";
import { Order } from "@/lib/types/order";
import { useEffect, useState } from "react";
import OrderManagement from "./order-management";

const OrderManagementPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      const fetchedOrders = await fetchAllOrders();
      setOrders(fetchedOrders);
    };

    loadOrders();
  }, []);
  return orders.length > 0 ? (
    <MaxWidthWrapper className="mx-auto flex flex-col">
      <OrderManagement allOrders={orders} />
    </MaxWidthWrapper>
  ) : null;
};

export default withAuth(OrderManagementPage);
