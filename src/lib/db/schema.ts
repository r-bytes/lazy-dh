import { decimal, integer, jsonb, pgTable, serial, text, timestamp, varchar, boolean,  } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()), // Generate a UUID for each user
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  postal: varchar("postal", { length: 10 }).notNull(), // Adjust the length as per the actual requirement
  phoneNumber: varchar("phone_number", { length: 15 }).notNull(),
  companyName: varchar("company_name", { length: 255 }),
  vatNumber: varchar("vat_number", { length: 20 }),
  chamberOfCommerceNumber: varchar("kvk_number", { length: 20 }), // 'KvK nummer' field
  resetPasswordToken: varchar("reset_password_token", { length: 255 }).unique(),
  resetPasswordTokenExpiry: timestamp("reset_password_token_expiry"),
  emailVerified: boolean("email_verified").default(false),
  emailVerificationToken: varchar("email_verification_token", { length: 255 }).unique(),
  adminApproved: boolean("admin_approved").default(false),
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
  activityData: varchar("activity_data", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});