"use server"
import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { Order } from "../types/order";
import { DatabaseUser } from "../types/user";

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

export async function fetchAllOrdersNotCompleted(): Promise<Order[]> {
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
      WHERE orders.status != 'Afgerond' AND orders.status != 'Geannuleerd'
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

export async function checkFavoriteStatus(userId: string, productId: string): Promise<boolean> {
  noStore();

  try {
    const query = `
      SELECT 
        COUNT(*) 
      FROM 
        favorite_products 
      WHERE 
        user_id = '${userId}' AND product_id = '${productId}';
    `;

    const { rows } = await sql.query(query);

    return rows[0].count > 0;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to check favorite status");
  }
}

export async function getFavoriteProductIds(userId: string): Promise<string[]> {
  noStore();
  if (!userId) {
    throw new Error("No userId");
  }

  try {
    const query = `
      SELECT 
        product_id
      FROM 
        favorite_products
      WHERE 
        user_id = $1;
    `;

    const { rows } = await sql.query(query, [userId]);

    return rows.map((row) => row.product_id);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch favorite product IDs");
  }
}

export async function addFavorite(userId: string, productId: string): Promise<boolean> {
  noStore();
  if (!userId || !productId) {
    throw new Error("User ID and Product ID are required");
  }

  try {
    const query = `
      INSERT INTO favorite_products (user_id, product_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, product_id) DO NOTHING; -- Prevents duplicate entries
    `;

    await sql.query(query, [userId, productId]);
    return true; // Successfully added
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add favorite product");
  }
}

export async function removeFavorite(userId: string, productId: string): Promise<boolean> {
  noStore();
  if (!userId || !productId) {
    throw new Error("User ID and Product ID are required");
  }

  try {
    const query = `
      DELETE FROM favorite_products
      WHERE user_id = $1 AND product_id = $2;
    `;

    await sql.query(query, [userId, productId]);
    return true; // Successfully removed
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to remove favorite product");
  }
}