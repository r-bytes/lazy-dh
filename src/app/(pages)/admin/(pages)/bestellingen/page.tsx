"use client";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import OrderManagement from "./order-management";
import withAuth from "@/hoc/withAuth";
import { useEffect, useState } from "react";
import { Order } from "@/lib/types/order";
import { fetchAllOrders } from "@/lib/db/data";

const OrderManagementPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
      const loadUsers = async () => {
        const fetchedOrders = await fetchAllOrders();
        setOrders(fetchedOrders);
      };

      loadUsers();
    }, []);
  return orders ? (
    <MaxWidthWrapper className="mx-auto flex flex-col">
      <OrderManagement allOrders={orders} />
    </MaxWidthWrapper>
  ): null;
};

export default withAuth(OrderManagementPage);