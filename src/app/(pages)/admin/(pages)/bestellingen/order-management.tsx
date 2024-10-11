"use client";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Title from "@/components/ui/title";
import { Order } from "@/lib/types/order";
import { formatCurrencyTwo } from "@/lib/utils";
import { EyeIcon, EyeOff } from "lucide-react";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BeatLoader from "react-spinners/BeatLoader";

const batchUpdateOrderStatuses = async (updates: { orderId: string; status: string }[]) => {
  const response = await fetch('/api/orders/batch-update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ updates }),
  });
  return response.json();
};
const OrderManagement = ({ session, allOrders }: { session?: Session; allOrders: Order[] }) => {
  const [orders, setOrders] = useState<Order[]>(allOrders);
  const [isLoading, setIsLoading] = useState(true);
  const [color, setColor] = useState("#facc15");
  const [editedOrders, setEditedOrders] = useState<Record<number, string>>({});
  const [isSaving, setIsSaving] = useState<Record<number, boolean>>({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [hideCompleted, setHideCompleted] = useState(true);

  // Sort state
  const [sortColumn, setSortColumn] = useState<string>("orderId");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Function to fetch orders
  const fetchOrders = async () => {
    setIsLoading(true);

    const transformedOrders = orders.map((orderData) => ({
      orderId: orderData.orderId,
      userId: orderData.userId,
      orderDate: orderData.orderDate,
      totalAmount: orderData.totalAmount,
      status: orderData.status,
      userName: orderData.userName,
      userEmail: orderData.userEmail,
      orderItems: orderData.orderItems!.length > 0 ? orderData.orderItems : null,
    }));

    // Custom sorting logic to put "Nieuw" status at the top
    transformedOrders.sort((a, b) => {
      // Priority for "Nieuw" status
      const priority = { Nieuw: 1, Bezig: 2, Afgerond: 3, Geannuleerd: 4 };
      if (a.status === "Nieuw" && b.status !== "Nieuw") return -1;
      if (a.status !== "Nieuw" && b.status === "Nieuw") return 1;

      // Other sorting logic
      const aValue = (a as { [key: string]: any })[sortColumn];
      const bValue = (b as { [key: string]: any })[sortColumn];
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setOrders(transformedOrders);

    // Initialize the editedOrders state with the current status
    const initialEditedOrders = transformedOrders.reduce(
      (acc, order) => {
        acc[order.orderId] = order.status;

        return acc;
      },
      {} as Record<number, string>
    );
    setEditedOrders(initialEditedOrders);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [sortColumn, sortDirection]);

  // const generatePDF = async (order: Order) => {
  //   console.log("downloading pdf ....");

  //   try {
  //     const userIdResponse = await fetch("/api/getUserIdByEmail", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email: session.user?.email }),
  //     });

  //     if (!userIdResponse.ok) {
  //       toast.dismiss();
  //       return;
  //     }

  //     const { userObject } = await userIdResponse.json();
  //     const formattedDate = getCurrentFormattedDate();

  //     const orderItemsData: Product[] = order.orderItems!.map((item) => ({
  //       image: {
  //         _type: "image",
  //         asset: {
  //           _ref: "string",
  //           _type: "reference",
  //         },
  //       },
  //       _id: item.name,
  //       _createdAt: formattedDate,
  //       _updatedAt: formattedDate,
  //       _rev: "unavailable",
  //       orderId: order.orderId,
  //       productId: Number(item.name),
  //       name: item.name,
  //       quantity: item.quantity,
  //       quantityInBox: item.quantityInBox,
  //       percentage: Number(item.percentage),
  //       volume: Number(item.volume),
  //       price: item.price,
  //       imgUrl: item.imgUrl,
  //       _type: "product",
  //       category: "product",
  //       description: item.name,
  //       inStock: true,
  //       inSale: false,
  //       isNew: false,
  //     }));

  //     const invoiceDetails: InvoiceDetails = {
  //       invoiceCustomerName: userObject!.name,
  //       invoiceCustomerEmail: userObject!.email,
  //       invoiceCustomerAddress: userObject!.address,
  //       invoiceCustomerCity: userObject!.city,
  //       invoiceCustomerPostal: userObject!.postal,
  //       invoiceCustomerPhoneNumber: userObject!.phoneNumber,
  //       companyName: userObject!.companyName,
  //       vatNumber: userObject!.vatNumber,
  //       chamberOfCommerceNumber: userObject!.chamberOfCommerceNumber,
  //       orderNumber: order.orderId.toString(),
  //       invoiceNumber: `${order.orderDate.toString()}-${order.orderId.toString()}`,
  //       date: formattedDate.toString(),
  //       invoiceCustomerCountry: "Nederland",
  //       shippingCustomerCustomerName: userObject!.name,
  //       shippingCustomerCustomerEmail: userObject!.email,
  //       shippingCustomerAddress: userObject!.address,
  //       shippingCustomerPostal: userObject!.postal,
  //       shippingCustomerCity: userObject!.city,
  //       shippingCustomerCountry: "Nederland",
  //       customerPhoneNumber: null,
  //     };

  //     if (!order) {
  //       toast.error("Geen order geselecteerd voor PDF creatie.");
  //       return;
  //     }

  //     const pdfBase64 = await createOrderSummaryDocument(orderItemsData, invoiceDetails);
  //     downloadPDF(pdfBase64, `Order-${order.orderId}.pdf`);
  //     toast.success("PDF generated and downloaded successfully!");

  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //     toast.error("Fout bij het genereren van de PDF.");
  //   }
  // };

  const handleStatusChange = (orderId: number, newStatus: string) => {
    // Update the local state with the new status
    setEditedOrders((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  const saveStatus = async (orderId: number) => {
    const newStatus = editedOrders[orderId];
    setIsSaving((prev) => ({ ...prev, [orderId]: true }));
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        cache: "no-store",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        // Update the local orders state to reflect the new status
        setOrders((prevOrders) => prevOrders.map((order) => (order.orderId === orderId ? { ...order, status: newStatus } : order)));
        toast.success("Status succesvol geupdate!");
      } else {
        toast.error(data.message);
        console.error("Failed to update order status:", data.message);
      }
    } catch (error) {
      toast.error("Fout bij het bijwerken van de status van de bestelling");
      console.error("Error updating order status:", error);
    } finally {
      setIsSaving((prev) => ({ ...prev, [orderId]: false })); // Reset saving state for the specific order
    }
  };

  // const saveStatus = async (orderId: number) => {
  //   const newStatus = editedOrders[orderId];
  //   try {
  //     const res = await fetch(`/api/admin/orders/${orderId}`, {
  //       cache: "no-store",
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ status: newStatus }),
  //     });

  //     const data = await res.json();
  //     if (data.success) {
  //       // Reload the orders data after updating the status
  //       fetchOrders();
  //       toast.success("Status succesvol geupdate!");
  //     } else {
  //       toast.error(data.message);
  //       console.error("Failed to update order status:", data.message);
  //     }
  //   } catch (error) {
  //     toast.error("Fout bij het bijwerken van de status van de bestelling");
  //     console.error("Error updating order status:", error);
  //   }
  // };

  // Handle sort column click
  const handleSort = (column: string) => {
    setSortColumn(column);
    setSortDirection((prevDirection) => (prevDirection === "asc" ? "desc" : "asc"));
  };

  const handleItemClick = (order: Order) => {
    if (!order.orderItems || order.orderItems.length === 0) {
      return;
    }
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  const handleHide = () => {
    setHideCompleted(!hideCompleted);
  };

  if (isLoading) {
    return (
      <div className="my-32">
        <BeatLoader color={color} loading={isLoading} size={20} aria-label="Loading Spinner" />
      </div>
    );
  }

  return (
    <>
      <Title name={"Bestellingen beheren"} />
      <Button variant={"outline"} className="self-end hover:cursor-pointer" onClick={handleHide}>
        {!hideCompleted ? <EyeIcon /> : <EyeOff />}
      </Button>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableCell className="hover:cursor-pointer" onClick={() => handleSort("orderId")}>
              Bestelnr. {sortColumn === "orderId" && (sortDirection === "asc" ? "▲" : "▼")}
            </TableCell>
            <TableCell className="hover:cursor-pointer" onClick={() => handleSort("userName")}>
              Klant {sortColumn === "userName" && (sortDirection === "asc" ? "▲" : "▼")}
            </TableCell>
            <TableCell className="hover:cursor-pointer" onClick={() => handleSort("userEmail")}>
              Email {sortColumn === "userEmail" && (sortDirection === "asc" ? "▲" : "▼")}
            </TableCell>
            <TableCell className="hover:cursor-pointer" onClick={() => handleSort("orderDate")}>
              Besteldatum {sortColumn === "orderDate" && (sortDirection === "asc" ? "▲" : "▼")}
            </TableCell>
            <TableCell className="hover:cursor-pointer" onClick={() => handleSort("totalAmount")}>
              Prijs {sortColumn === "totalAmount" && (sortDirection === "asc" ? "▲" : "▼")}
            </TableCell>
            <TableCell> Status </TableCell>
            <TableCell> Producten </TableCell>
            <TableCell> Acties </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders
            .filter((order) => !hideCompleted || (order.status !== "Afgerond" && order.status !== "Geannuleerd"))
            .map((order) => (
              <TableRow key={order.orderId} className={order.status === "Nieuw" ? "bg-primary/20" : ""}>
                <TableCell className="min-w-fit">{order.orderId}</TableCell>
                <TableCell className="min-w-fit">{order.userName}</TableCell>
                <TableCell className="min-w-fit">{order.userEmail}</TableCell>
                <TableCell className="min-w-fit">{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                <TableCell className="min-w-fit">{formatCurrencyTwo(parseFloat(order.totalAmount))}</TableCell>
                <TableCell>
                  <Select value={editedOrders[order.orderId]} onValueChange={(value: string) => handleStatusChange(order.orderId, value)}>
                    <SelectTrigger className="w-36">
                      <SelectValue>{editedOrders[order.orderId]}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="cursor-pointer" value="Nieuw">
                        Nieuw
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="Bezig">
                        Bezig
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="Afgerond">
                        Afgerond
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="Geannuleerd">
                        Geannuleerd
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell
                  className={order.orderItems && order.orderItems?.length > 0 ? "underline underline-offset-4 " : ""}
                  onClick={() => handleItemClick(order)}
                  style={order.orderItems && order.orderItems?.length > 0 ? { cursor: "pointer" } : {}}
                >
                  {order.orderItems && order.orderItems.length > 0 ? "Bekijk de producten" : "Geen producten"}
                </TableCell>
                <TableCell>
                  <Button className="w-32" onClick={() => saveStatus(order.orderId)}>
                    {isSaving[order.orderId] ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : "Status opslaan"}
                  </Button>
                  {/* <Button onClick={async () => selectedOrder && await generatePDF(selectedOrder)}>Genereer PDF</Button> */}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {selectedOrder && (
        <Drawer direction="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          <DrawerContent className="fixed right-0 min-w-fit focus:outline-none sm:ml-[10%] md:ml-[75%]">
            <DrawerHeader>
              <DrawerTitle> Bestelling overzicht</DrawerTitle>
              <DrawerDescription>
                {`${selectedOrder.orderItems?.length} ${selectedOrder.orderItems?.length && selectedOrder.orderItems?.length > 1 ? "producten in bestelling" : "product in bestelling"}`}
                #{selectedOrder.orderId}
              </DrawerDescription>
            </DrawerHeader>
            <div className="w-full border">
              {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 ? (
                selectedOrder.orderItems.map((item, index) => (
                  <div className="p-4" key={index}>
                    <h1 className="mb-4 pl-1 font-semibold">Product {index + 1}</h1>
                    <ul className="list-disc pl-3 text-xs">
                      <li>Naam: {item.name}</li>
                      <li>Percentage: {item.percentage}</li>
                      <li>Liter inhoud: {item.volume}</li>
                      <li>Aantal in doos: {item.quantityInBox}</li>
                      <li>Aantal besteld: {item.quantity}</li>
                    </ul>
                  </div>
                ))
              ) : (
                <p>No items in this order.</p>
              )}
            </div>
            <DrawerFooter>
              <Button onClick={() => setIsDrawerOpen(false)}>Close</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default OrderManagement;
