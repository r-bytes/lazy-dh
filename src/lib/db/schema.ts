import { datetime } from "drizzle-orm/mysql-core";
import { decimal, integer, jsonb, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  address: text("address"),
  phoneNumber: varchar("phone_number", { length: 15 }),
  resetPasswordToken: varchar("reset_password_token", { length: 255 }).unique(),
  resetPasswordTokenExpiry: timestamp("reset_password_token_expiry"),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  orderDate: timestamp("order_date").defaultNow(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  paymentId: varchar("payment_id", { length: 100 }),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  productId: text("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  quantityInBox: integer("quantity_in_box").notNull(),
  volume: varchar("volume", { length: 100 }),
  percentage: varchar("percentage", { length: 100 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imgUrl: varchar("img_url", { length: 100 }),
});

export const userActivities = pgTable("user_activities", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  activityType: varchar("activity_type", { length: 50 }).notNull(),
  activityData: jsonb("activity_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull(),
  category: varchar("category", { length: 50 }),
  imageUrl: text("image_url"),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  paymentMethod: varchar("payment_method", { length: 50 }),
  paymentStatus: varchar("payment_status", { length: 50 }),
  transactionId: varchar("transaction_id", { length: 100 }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentDate: timestamp("payment_date").defaultNow(),
});
