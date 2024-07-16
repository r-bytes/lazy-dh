"use client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { ApiResponse, Order } from "@/lib/types/order";
import { formatCurrencyTwo } from "@/lib/utils";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editedOrders, setEditedOrders] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/admin/orders");
        const data: ApiResponse = await res.json();
        if (data.success) {
          const transformedOrders = data.orders.map((order) => ({
            id: order.orders.id,
            userId: order.orders.userId,
            orderDate: order.orders.orderDate,
            totalAmount: order.orders.totalAmount,
            status: order.orders.status,
            user: {
              name: order.users.name,
              email: order.users.email,
            },
            items: order.orderItems,
          }));
          setOrders(transformedOrders);

          // Initialize the editedOrders state with the current status
          const initialEditedOrders = transformedOrders.reduce(
            (acc, order) => {
              acc[order.id] = order.status;
              return acc;
            },
            {} as Record<number, string>
          );
          setEditedOrders(initialEditedOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = (orderId: number, newStatus: string) => {
    // Update the local state with the new status
    setEditedOrders((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  const saveStatus = async (orderId: number) => {
    const newStatus = editedOrders[orderId];
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        // Update the orders state with the new status if API request is successful
        setOrders((prevOrders) => prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)));
        toast.success("Status succesvol geupdate!");
      } else {
        toast.error(data.message);
        console.error("Failed to update order status:", data.message);
      }
    } catch (error) {
      toast.error("Error updating order status");
      console.error("Error updating order status:", error);
    }
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-bold">Order Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="min-w-fit"> Order nr. </TableCell>
            <TableCell className="min-w-fit"> Klant </TableCell>
            <TableCell className="min-w-fit"> Email </TableCell>
            <TableCell className="min-w-fit"> Order datum </TableCell>
            <TableCell className="min-w-fit"> Total Amount </TableCell>
            <TableCell className="min-w-fit"> Status </TableCell>
            <TableCell className="min-w-fit"> Producten </TableCell>
            <TableCell className="min-w-fit"> Acties </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="min-w-fit">{order.id}</TableCell>
              <TableCell className="min-w-fit">{order.user.name}</TableCell>
              <TableCell className="min-w-fit">{order.user.email}</TableCell>
              <TableCell className="min-w-fit">{new Date(order.orderDate).toLocaleDateString()}</TableCell>
              <TableCell className="min-w-fit">{formatCurrencyTwo(parseFloat(order.totalAmount))}</TableCell>
              <TableCell>
                <Select value={editedOrders[order.id]} onValueChange={(value: string) => handleStatusChange(order.id, value)}>
                  <SelectTrigger>
                    <SelectValue>{editedOrders[order.id]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In behandeling"> Behandeling </SelectItem>
                    <SelectItem value="Afgehandeld"> Afgehandeld </SelectItem>
                    <SelectItem value="Geannuleerd"> Geannuleerd </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {order.items ? (
                  <div>
                    <p>Naam: {order.items.name}</p>
                    <p>Liter inhoud: {order.items.volume}</p>
                    <p>Percentage: {order.items.percentage}</p>
                    <p>Hoeveelheid in doos: {order.items.quantityInBox}</p>
                    <p>Price per doos: {formatCurrencyTwo(Number(order.items.price) * order.items.quantityInBox)}</p>
                    <p>Aantal: {order.items.quantity}</p>
                  </div>
                ) : (
                  <p> Geen producten in deze bestelling. </p>
                )}
              </TableCell>
              <TableCell>
                <Button onClick={() => saveStatus(order.id)}> Status opslaan </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderManagement;
