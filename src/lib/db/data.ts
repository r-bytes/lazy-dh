"use server"
import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { DatabaseUser } from "../types/user";
import { Order } from "../types/order";

export const fetchAllUsers = async (): Promise<DatabaseUser[]> => {
  noStore();
  const { rows } = await sql<DatabaseUser>`SELECT * FROM users`;
  return rows;
};

export const fetchUsersNeedApproval = async (): Promise<DatabaseUser[]> => {
  noStore();
  const { rows } = await sql<DatabaseUser>`SELECT * FROM users WHERE admin_approved != true`;
  return rows;
};

export async function fetchAllOrders(): Promise<Order[]> {
  noStore();

  try {
    // Fetch all orders, including user and order item details
    const query = `
      SELECT 
        orders.id AS "orderId",
        orders.user_id AS "userId",
        orders.order_date AS "orderDate",
        orders.total_amount AS "totalAmount",
        orders.status AS "status",
        users.name AS "userName",
        users.email AS "userEmail",
        COALESCE(
          json_agg(
            json_build_object(
              'name', order_items.name,
              'quantity', order_items.quantity,
              'quantityInBox', order_items.quantity_in_box,
              'volume', order_items.volume,
              'percentage', order_items.percentage,
              'price', order_items.price,
              'imgUrl', order_items.img_url
            )
          ) FILTER (WHERE order_items.order_id IS NOT NULL),
          '[]'
        ) AS "orderItems"
      FROM orders
      LEFT JOIN users ON orders.user_id = users.id
      LEFT JOIN order_items ON order_items.order_id = orders.id
      GROUP BY 
        orders.id, 
        orders.user_id, 
        orders.order_date, 
        orders.total_amount, 
        orders.status, 
        users.name, 
        users.email;
    `;

    const { rows } = await sql.query(query);

    return rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch orders");
  }
}

// export async function fetchLatestInvoices() {
//   noStore();
//   try {
//     const data = await sql<LatestInvoiceRaw>`
//       SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
//       FROM invoices
//       JOIN customers ON invoices.customer_id = customers.id
//       ORDER BY invoices.date DESC
//       LIMIT 5`;

//     const latestInvoices = data.rows.map((invoice) => ({
//       ...invoice,
//       amount: formatCurrency(invoice.amount),
//     }));
//     return latestInvoices;
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to fetch the latest invoices.");
//   }
// }

// export async function fetchCardData() {
//   noStore();
//   try {
//     // You can probably combine these into a single SQL query
//     // However, we are intentionally splitting them to demonstrate
//     // how to initialize multiple queries in parallel with JS.
//     const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
//     const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
//     const invoiceStatusPromise = sql`SELECT
//          SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
//          SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
//          FROM invoices`;

//     const data = await Promise.all([invoiceCountPromise, customerCountPromise, invoiceStatusPromise]);

//     const numberOfInvoices = Number(data[0].rows[0].count ?? "0");
//     const numberOfCustomers = Number(data[1].rows[0].count ?? "0");
//     const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? "0");
//     const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? "0");

//     return {
//       numberOfCustomers,
//       numberOfInvoices,
//       totalPaidInvoices,
//       totalPendingInvoices,
//     };
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to fetch card data.");
//   }
// }

// const ITEMS_PER_PAGE = 6;
// export async function fetchFilteredInvoices(query: string, currentPage: number) {
//   noStore();
//   const offset = (currentPage - 1) * ITEMS_PER_PAGE;

//   try {
//     const invoices = await sql<InvoicesTable>`
//       SELECT
//         invoices.id,
//         invoices.amount,
//         invoices.date,
//         invoices.status,
//         customers.name,
//         customers.email,
//         customers.image_url
//       FROM invoices
//       JOIN customers ON invoices.customer_id = customers.id
//       WHERE
//         customers.name ILIKE ${`%${query}%`} OR
//         customers.email ILIKE ${`%${query}%`} OR
//         invoices.amount::text ILIKE ${`%${query}%`} OR
//         invoices.date::text ILIKE ${`%${query}%`} OR
//         invoices.status ILIKE ${`%${query}%`}
//       ORDER BY invoices.date DESC
//       LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
//     `;

//     return invoices.rows;
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to fetch invoices.");
//   }
// }

// export async function fetchInvoicesPages(query: string) {
//   noStore();
//   try {
//     const count = await sql`SELECT COUNT(*)
//     FROM invoices
//     JOIN customers ON invoices.customer_id = customers.id
//     WHERE
//       customers.name ILIKE ${`%${query}%`} OR
//       customers.email ILIKE ${`%${query}%`} OR
//       invoices.amount::text ILIKE ${`%${query}%`} OR
//       invoices.date::text ILIKE ${`%${query}%`} OR
//       invoices.status ILIKE ${`%${query}%`}
//   `;

//     const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
//     return totalPages;
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to fetch total number of invoices.");
//   }
// }

// export async function fetchInvoiceById(id: string) {
//   noStore();
//   try {
//     const data = await sql<InvoiceForm>`
//       SELECT
//         invoices.id,
//         invoices.customer_id,
//         invoices.amount,
//         invoices.status
//       FROM invoices
//       WHERE invoices.id = ${id};
//     `;

//     const invoice = data.rows.map((invoice) => ({
//       ...invoice,
//       // Convert amount from cents to dollars
//       amount: invoice.amount / 100,
//     }));

//     return invoice[0];
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to fetch invoice.");
//   }
// }

// export async function fetchCustomers() {
//   noStore();
//   try {
//     const data = await sql<CustomerField>`
//       SELECT
//         id,
//         name
//       FROM customers
//       ORDER BY name ASC
//     `;

//     const customers = data.rows;
//     return customers;
//   } catch (err) {
//     console.error("Database Error:", err);
//     throw new Error("Failed to fetch all customers.");
//   }
// }

// export async function fetchFilteredCustomers(query: string) {
//   noStore();
//   try {
//     const data = await sql<CustomersTable>`
// 		SELECT
// 		  customers.id,
// 		  customers.name,
// 		  customers.email,
// 		  customers.image_url,
// 		  COUNT(invoices.id) AS total_invoices,
// 		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
// 		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
// 		FROM customers
// 		LEFT JOIN invoices ON customers.id = invoices.customer_id
// 		WHERE
// 		  customers.name ILIKE ${`%${query}%`} OR
//         customers.email ILIKE ${`%${query}%`}
// 		GROUP BY customers.id, customers.name, customers.email, customers.image_url
// 		ORDER BY customers.name ASC
// 	  `;

//     const customers = data.rows.map((customer) => ({
//       ...customer,
//       total_pending: formatCurrency(customer.total_pending),
//       total_paid: formatCurrency(customer.total_paid),
//     }));

//     return customers;
//   } catch (err) {
//     console.error("Database Error:", err);
//     throw new Error("Failed to fetch customer table.");
//   }
// }

// export async function getUser(email: string) {
//   noStore();
//   try {
//     const user = await sql`SELECT * FROM users WHERE email=${email}`;
//     return user.rows[0] as User;
//   } catch (error) {
//     console.error("Failed to fetch user:", error);
//     throw new Error("Failed to fetch user.");
//   }
// }
