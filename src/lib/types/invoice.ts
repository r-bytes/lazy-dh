export interface InvoiceDetails {
  orderNumber: string;
  invoiceNumber: string;
  date: string;
  invoiceCustomerName: string | null;
  invoiceCustomerEmail: string;
  invoiceCustomerAddress: string;
  invoiceCustomerPostal: string;
  invoiceCustomerCity: string;
  invoiceCustomerCountry: string;
  invoiceCustomerPhoneNumber: string | null;
  shippingCustomerCustomerName: string | null;
  shippingCustomerCustomerEmail: string;
  shippingCustomerAddress: string;
  shippingCustomerPostal: string;
  shippingCustomerCity: string;
  shippingCustomerCountry: string;
  customerPhoneNumber: string | null;
  companyName: string | null;
  vatNumber: string | null;
  chamberOfCommerceNumber: string | null;
}