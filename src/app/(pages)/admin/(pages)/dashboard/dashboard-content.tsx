"use client";

import downloadPDF from "@/actions/pdf/downloadPDF";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Title from "@/components/ui/title";
import { formatCurrencyTwo, formatDateToLocal } from "@/lib/utils";
import {
  AlertTriangle,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  DollarSign,
  FileDown,
  Mail,
  MapPin,
  Phone,
  Search,
  ShoppingCart,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BeatLoader from "react-spinners/BeatLoader";

interface DashboardStats {
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: { status: string; count: number }[];
  recentOrders: number;
  recentRevenue: number;
}

interface Customer {
  userId: string;
  name: string;
  email: string;
  city: string | null;
  companyName: string | null;
  createdAt: Date | string | null;
  adminApproved: boolean | null;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
}

interface OrderItem {
  name: string;
  quantity: number;
  quantityInBox: number;
  volume: string;
  percentage: string;
  price: number;
  imgUrl: string;
}

interface CustomerOrder {
  orderId: number;
  orderDate: string;
  totalAmount: string;
  status: string;
  paymentId: string | null;
  orderItems: OrderItem[];
}

interface CustomerDetail extends Customer {
  address: string | null;
  postal: string | null;
  phoneNumber: string | null;
  vatNumber: string | null;
  chamberOfCommerceNumber: string | null;
}

const DashboardContent = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetail | null>(null);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [expandedCustomers, setExpandedCustomers] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredCustomers(
        customers.filter(
          (customer) =>
            customer.name.toLowerCase().includes(query) ||
            customer.email.toLowerCase().includes(query) ||
            customer.city?.toLowerCase().includes(query) ||
            customer.companyName?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, customers]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, customersRes] = await Promise.all([fetch("/api/admin/dashboard/stats"), fetch("/api/admin/dashboard/customers")]);

      if (!statsRes.ok || !customersRes.ok) {
        throw new Error("Failed to load dashboard data");
      }

      const statsData = await statsRes.json();
      const customersData = await customersRes.json();

      setStats(statsData.stats);
      setCustomers(customersData.customers);
      setFilteredCustomers(customersData.customers);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast.error("Fout bij het laden van dashboard gegevens");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCustomerDetails = async (customerId: string) => {
    if (expandedCustomers.has(customerId)) {
      setExpandedCustomers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(customerId);
        return newSet;
      });
      setSelectedCustomer(null);
      setCustomerOrders([]);
    } else {
      setIsLoadingCustomer(true);
      try {
        const response = await fetch(`/api/admin/dashboard/customers?userId=${customerId}`);
        if (!response.ok) throw new Error("Failed to load customer details");

        const data = await response.json();
        setSelectedCustomer(data.customer);
        setCustomerOrders(data.orders);
        setExpandedCustomers((prev) => new Set(prev).add(customerId));
      } catch (error) {
        console.error("Error loading customer details:", error);
        toast.error("Fout bij het laden van klantgegevens");
      } finally {
        setIsLoadingCustomer(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Nieuw":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Bezig":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Afgerond":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Geannuleerd":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const handleDownloadCustomerPDF = async (customerId: string, customerName: string) => {
    setIsGeneratingPDF(customerId);
    try {
      const response = await fetch(`/api/admin/dashboard/customers/${customerId}/pdf`);

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const data = await response.json();

      if (data.success && data.pdf) {
        const filename = `Klant-${customerName.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`;
        downloadPDF(data.pdf, filename);
        toast.success("PDF succesvol gedownload");
      } else {
        throw new Error(data.message || "Fout bij het genereren van de PDF");
      }
    } catch (error) {
      console.error("Error downloading customer PDF:", error);
      toast.error("Fout bij het downloaden van de PDF");
    } finally {
      setIsGeneratingPDF(null);
    }
  };

  // Verify order total matches sum of order items (including VAT)
  const verifyOrderTotal = (
    order: CustomerOrder
  ): { isValid: boolean; calculatedTotal: number; calculatedTotalExVAT: number; vatAmount: number; difference: number } => {
    if (!order.orderItems || order.orderItems.length === 0) {
      return { isValid: true, calculatedTotal: 0, calculatedTotalExVAT: 0, vatAmount: 0, difference: 0 };
    }

    // Calculate total excluding VAT (sum of all products)
    const calculatedTotalExVAT = order.orderItems.reduce((sum, item) => {
      const itemTotal = Number(item.price) * item.quantity * item.quantityInBox;
      return sum + itemTotal;
    }, 0);

    // Calculate VAT (21% in Netherlands)
    const vatAmount = calculatedTotalExVAT * 0.21;

    // Calculate total including VAT
    const calculatedTotal = calculatedTotalExVAT + vatAmount;

    const storedTotal = Number(order.totalAmount);
    const difference = Math.abs(calculatedTotal - storedTotal);
    const isValid = difference < 0.01; // Allow for small floating point differences

    return { isValid, calculatedTotal, calculatedTotalExVAT, vatAmount, difference };
  };

  if (isLoading) {
    return (
      <div className="my-32 flex items-center justify-center">
        <BeatLoader color="#facc15" loading={isLoading} size={20} aria-label="Loading Spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8">
      <Title name="Dashboard" />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Klanten</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCustomers || 0}</div>
            <p className="text-xs text-muted-foreground">Goedgekeurde accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Bestellingen</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.recentOrders || 0} in laatste 30 dagen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Omzet</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats ? formatCurrencyTwo(stats.totalRevenue) : "€ 0,00"}</div>
            <p className="text-xs text-muted-foreground">{stats ? formatCurrencyTwo(stats.recentRevenue) : "€ 0,00"} laatste 30 dagen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gemiddelde Bestelwaarde</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats ? formatCurrencyTwo(stats.averageOrderValue) : "€ 0,00"}</div>
            <p className="text-xs text-muted-foreground">Per bestelling</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders by Status */}
      {stats && stats.ordersByStatus.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Bestellingen per Status</CardTitle>
            <CardDescription>Overzicht van bestellingen gegroepeerd per status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {stats.ordersByStatus.map((item) => (
                <div key={item.status} className="flex items-center gap-2 rounded-lg border p-2 sm:p-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium sm:text-sm ${getStatusColor(item.status)}`}>{item.status}</span>
                  <span className="text-base font-semibold sm:text-lg">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customers List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Klanten Overzicht</CardTitle>
              <CardDescription>Bekijk alle klanten en hun bestellingen</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Zoek klanten..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">Geen klanten gevonden</div>
            ) : (
              filteredCustomers.map((customer) => {
                const isExpanded = expandedCustomers.has(customer.userId);
                const isSelected = selectedCustomer?.userId === customer.userId;

                return (
                  <div key={customer.userId} className="space-y-2">
                    <div className="rounded-lg border bg-card p-4 transition-all hover:shadow-md">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="break-words font-semibold">{customer.name}</h3>
                              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1 break-all">
                                  <Mail className="h-3 w-3 shrink-0" />
                                  <span className="break-all">{customer.email}</span>
                                </span>
                                {customer.city && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 shrink-0" />
                                    {customer.city}
                                  </span>
                                )}
                                {customer.companyName && (
                                  <span className="flex items-center gap-1 break-words">
                                    <Building2 className="h-3 w-3 shrink-0" />
                                    <span className="break-words">{customer.companyName}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                          <div className="flex gap-4 sm:gap-6">
                            <div className="text-left sm:text-right">
                              <div className="text-xs text-muted-foreground sm:text-sm">Totaal besteed</div>
                              <div className="text-base font-semibold sm:text-lg">{formatCurrencyTwo(customer.totalSpent)}</div>
                            </div>
                            <div className="text-left sm:text-right">
                              <div className="text-xs text-muted-foreground sm:text-sm">Bestellingen</div>
                              <div className="text-base font-semibold sm:text-lg">{customer.totalOrders}</div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleCustomerDetails(customer.userId)}
                            disabled={isLoadingCustomer}
                            className="w-full sm:w-auto"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="mr-2 h-4 w-4" />
                                Verberg
                              </>
                            ) : (
                              <>
                                <ChevronDown className="mr-2 h-4 w-4" />
                                Details
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Customer Details */}
                    {isExpanded && isSelected && (
                      <div className="ml-0 rounded-lg border bg-muted/30 p-4 sm:ml-4 sm:p-6">
                        {isLoadingCustomer ? (
                          <div className="flex items-center justify-center py-8">
                            <BeatLoader color="#facc15" loading={true} size={10} />
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {/* Customer Information */}
                            <div>
                              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <h4 className="text-lg font-semibold">Klantgegevens</h4>
                                <Button
                                  onClick={() => handleDownloadCustomerPDF(selectedCustomer.userId, selectedCustomer.name)}
                                  disabled={isGeneratingPDF === selectedCustomer.userId}
                                  variant="outline"
                                  size="sm"
                                  className="w-full gap-2 sm:w-auto"
                                >
                                  {isGeneratingPDF === selectedCustomer.userId ? (
                                    <>
                                      <BeatLoader color="#000" loading={true} size={8} />
                                      <span>PDF genereren...</span>
                                    </>
                                  ) : (
                                    <>
                                      <FileDown className="h-4 w-4" />
                                      <span>Download PDF</span>
                                    </>
                                  )}
                                </Button>
                              </div>
                              <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Naam:</span>
                                    <span>{selectedCustomer.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Email:</span>
                                    <span>{selectedCustomer.email}</span>
                                  </div>
                                  {selectedCustomer.phoneNumber && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <Phone className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">Telefoon:</span>
                                      <span>{selectedCustomer.phoneNumber}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="space-y-2">
                                  {selectedCustomer.address && (
                                    <div className="flex items-start gap-2 text-sm">
                                      <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                      <div>
                                        <span className="font-medium">Adres:</span>
                                        <div>
                                          {selectedCustomer.address}
                                          {selectedCustomer.postal && `, ${selectedCustomer.postal}`}
                                          {selectedCustomer.city && ` ${selectedCustomer.city}`}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {selectedCustomer.companyName && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <Building2 className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">Bedrijf:</span>
                                      <span>{selectedCustomer.companyName}</span>
                                    </div>
                                  )}
                                  {selectedCustomer.vatNumber && (
                                    <div className="text-sm">
                                      <span className="font-medium">BTW Nummer:</span> {selectedCustomer.vatNumber}
                                    </div>
                                  )}
                                  {selectedCustomer.chamberOfCommerceNumber && (
                                    <div className="text-sm">
                                      <span className="font-medium">KvK Nummer:</span> {selectedCustomer.chamberOfCommerceNumber}
                                    </div>
                                  )}
                                  {selectedCustomer.createdAt && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <Calendar className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">Lid sinds:</span>
                                      <span>{formatDateToLocal(selectedCustomer.createdAt.toString(), "nl-NL")}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Customer Statistics */}
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm font-medium">Totaal Besteed</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold">{formatCurrencyTwo(customer.totalSpent)}</div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm font-medium">Aantal Bestellingen</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold">{customer.totalOrders}</div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm font-medium">Gemiddelde Bestelwaarde</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold">
                                    {customer.totalOrders > 0 ? formatCurrencyTwo(customer.totalSpent / customer.totalOrders) : "€ 0,00"}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            {/* Orders List */}
                            <div>
                              <h4 className="mb-4 text-lg font-semibold">Alle Bestellingen</h4>
                              {customerOrders.length === 0 ? (
                                <div className="py-8 text-center text-muted-foreground">Geen bestellingen gevonden</div>
                              ) : (
                                <div className="space-y-4">
                                  {customerOrders.map((order) => {
                                    const verification = verifyOrderTotal(order);

                                    return (
                                      <Card key={order.orderId}>
                                        <CardHeader>
                                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                              <CardTitle className="text-base">Bestelling #{order.orderId}</CardTitle>
                                              <CardDescription>{formatDateToLocal(order.orderDate, "nl-NL")}</CardDescription>
                                            </div>
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                              <span
                                                className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}
                                              >
                                                {order.status}
                                              </span>
                                              <div className="text-left sm:text-right">
                                                <div className="text-xs text-muted-foreground sm:text-sm">Totaal (incl. BTW)</div>
                                                <div className="text-base font-semibold sm:text-lg">
                                                  {formatCurrencyTwo(Number(order.totalAmount))}
                                                </div>
                                                {!verification.isValid && (
                                                  <div className="mt-1 flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                                                    <AlertTriangle className="h-3 w-3" />
                                                    <span>Berekend: {formatCurrencyTwo(verification.calculatedTotal)}</span>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                          {!verification.isValid && (
                                            <div className="mt-3 rounded-md border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
                                              <div className="flex items-start gap-2">
                                                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
                                                <div className="text-sm text-yellow-800 dark:text-yellow-300">
                                                  <strong>Waarschuwing:</strong> De opgeslagen totaal (
                                                  {formatCurrencyTwo(Number(order.totalAmount))}) komt niet overeen met de berekende som van de
                                                  producten incl. BTW ({formatCurrencyTwo(verification.calculatedTotal)}). Verschil:{" "}
                                                  {formatCurrencyTwo(verification.difference)}
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </CardHeader>
                                        <CardContent>
                                          {order.orderItems && order.orderItems.length > 0 && (
                                            <div className="-mx-6 overflow-x-auto sm:mx-0">
                                              <div className="inline-block min-w-full align-middle">
                                                <Table className="w-full">
                                                  <TableHeader>
                                                    <TableRow>
                                                      <TableHead className="!min-w-[600px]">Product</TableHead>
                                                      <TableHead
                                                        className="whitespace-nowrap text-center sm:text-left"
                                                        style={{ minWidth: "100px", width: "auto" }}
                                                      >
                                                        Aantal
                                                      </TableHead>
                                                      <TableHead
                                                        className="whitespace-nowrap text-center sm:text-left"
                                                        style={{ minWidth: "100px", width: "auto" }}
                                                      >
                                                        Prijs
                                                      </TableHead>
                                                      <TableHead
                                                        className="whitespace-nowrap text-right"
                                                        style={{ minWidth: "120px", width: "auto" }}
                                                      >
                                                        Subtotaal
                                                      </TableHead>
                                                    </TableRow>
                                                  </TableHeader>
                                                  <TableBody>
                                                    {order.orderItems.map((item, idx) => (
                                                      <TableRow key={idx}>
                                                        <TableCell className="!min-w-[600px] !max-w-none">
                                                          <div className="flex items-start gap-3">
                                                            <div className="flex-1">
                                                              <div className="text-sm font-medium sm:text-base">{item.name}</div>
                                                              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                                                                {item.volume} • {item.percentage}
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap text-center text-sm sm:text-left sm:text-base">
                                                          {item.quantity} × {item.quantityInBox}
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap text-center text-sm sm:text-left sm:text-base">
                                                          {formatCurrencyTwo(Number(item.price))}
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap text-right text-sm font-semibold sm:text-base">
                                                          {formatCurrencyTwo(Number(item.price) * item.quantity * item.quantityInBox)}
                                                        </TableCell>
                                                      </TableRow>
                                                    ))}
                                                    <TableRow className="border-t">
                                                      <TableCell colSpan={3} className="text-right text-sm font-medium sm:text-base">
                                                        Subtotaal (excl. BTW):
                                                      </TableCell>
                                                      <TableCell className="text-right text-sm font-medium sm:text-base">
                                                        {formatCurrencyTwo(verification.calculatedTotalExVAT)}
                                                      </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                      <TableCell colSpan={3} className="text-right text-sm font-medium sm:text-base">
                                                        BTW (21%):
                                                      </TableCell>
                                                      <TableCell className="text-right text-sm font-medium sm:text-base">
                                                        {formatCurrencyTwo(verification.vatAmount)}
                                                      </TableCell>
                                                    </TableRow>
                                                    <TableRow className="border-t-2 font-semibold">
                                                      <TableCell colSpan={3} className="text-right text-base sm:text-lg">
                                                        Totaal (incl. BTW):
                                                      </TableCell>
                                                      <TableCell className="text-right text-base sm:text-lg">
                                                        {formatCurrencyTwo(verification.calculatedTotal)}
                                                      </TableCell>
                                                    </TableRow>
                                                  </TableBody>
                                                </Table>
                                              </div>
                                            </div>
                                          )}
                                        </CardContent>
                                      </Card>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardContent;
