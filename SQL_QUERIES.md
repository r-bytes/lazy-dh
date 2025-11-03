# SQL Queries voor Omzet Controle

Voer deze queries uit in je database console (bijv. via Drizzle Studio of je database client):

## Totale Omzet (excl. geannuleerd)

```sql
SELECT
  COALESCE(SUM(total_amount::numeric), 0) as totale_omzet
FROM orders
WHERE status != 'Geannuleerd';
```

## Totale Omzet (incl. geannuleerd)

```sql
SELECT
  COALESCE(SUM(total_amount::numeric), 0) as totale_omzet_alles
FROM orders;
```

## Omzet per Status

```sql
SELECT
  status,
  COUNT(*) as aantal_bestellingen,
  COALESCE(SUM(total_amount::numeric), 0) as omzet
FROM orders
GROUP BY status
ORDER BY omzet DESC;
```

## Berekende Omzet vanuit Order Items (incl. BTW)

```sql
SELECT
  COALESCE(SUM(price::numeric * quantity * quantity_in_box), 0) as subtotaal_ex_btw,
  COALESCE(SUM(price::numeric * quantity * quantity_in_box * 1.21), 0) as totaal_incl_btw
FROM order_items
INNER JOIN orders ON order_items.order_id = orders.id
WHERE orders.status != 'Geannuleerd';
```

## Verificatie: Vergelijk opgeslagen vs berekend

```sql
SELECT
  (SELECT COALESCE(SUM(total_amount::numeric), 0)
   FROM orders
   WHERE status != 'Geannuleerd') as opgeslagen_omzet,
  (SELECT COALESCE(SUM(price::numeric * quantity * quantity_in_box * 1.21), 0)
   FROM order_items
   INNER JOIN orders ON order_items.order_id = orders.id
   WHERE orders.status != 'Geannuleerd') as berekende_omzet,
  (SELECT COALESCE(SUM(total_amount::numeric), 0)
   FROM orders
   WHERE status != 'Geannuleerd') -
  (SELECT COALESCE(SUM(price::numeric * quantity * quantity_in_box * 1.21), 0)
   FROM order_items
   INNER JOIN orders ON order_items.order_id = orders.id
   WHERE orders.status != 'Geannuleerd') as verschil;
```

## Via Drizzle Studio

Je kunt ook Drizzle Studio gebruiken:

```bash
npm run db:studio
```

Dan kun je visueel door de data navigeren en queries uitvoeren.
