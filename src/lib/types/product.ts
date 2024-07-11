// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  status: "pending" | "paid";
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, "amount"> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: "pending" | "paid";
};

export type CustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};



// export type Product = {
//   _id: number;
//   name: string;
//   description: string;
//   price: number;
//   image: string;
//   quantity: number;
//   slug: string;
// };

import { SanityDocument } from "@sanity/types";

export interface Product extends SanityDocument {
  _type: "product";
  image: Image;
  name: string;
  category: string;
  description: string;
  price: number;
  volume?: number;
  percentage?: number;
  inStock: number;
  inSale: boolean;
  isNew: boolean;
  quantityInBox: number;
  quantity: number;
}

export interface Image {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}

export default Product;

