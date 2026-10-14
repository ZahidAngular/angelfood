/* ==========================================================================
   Angel Food — the pre-sale price, 14 October 2026

   REQUIRED for the pre-sale to be real.

   The buy-now page now announces a $1 discount on each meal, and the carton
   card will show the regular price alongside it as a comparison. Neither is
   the price anyone is charged: the website reads the catalogue, and the
   server works the total out again from the same catalogue when the order is
   placed. Until this runs, the page promises a discount the checkout does
   not give.

   $11.90 a meal over a carton of 12 is $142.80.
   The regular price is $12.90 a meal, $154.80 a carton.

   The carton card is written so that it hides the comparison line while the
   catalogue still holds the regular price, so nothing contradicts itself in
   the meantime — but the line at the top of the page does promise the
   discount, so this wants running as the pre-sale opens rather than after.

   PUTTING IT BACK when the pre-sale closes is the second statement at the
   bottom, commented out. Set PRE_SALE.active to false in lib/pricing.ts at
   the same time.
   ========================================================================== */

SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRANSACTION;

/* Pre-sale: $11.90 a meal. */
UPDATE WebsiteProudcts
SET BaseCartonPrice = 142.80
WHERE Section = 'Meals' AND CartonQty = 12;

/* Expect nine meals at 142.80, a per-meal price of 11.90. */
SELECT
    Code,
    Name,
    CartonQty,
    BaseCartonPrice,
    CAST(BaseCartonPrice / NULLIF(CartonQty, 0) AS DECIMAL(10, 2)) AS PricePerMeal
FROM WebsiteProudcts
WHERE Section = 'Meals'
ORDER BY Name;

/* --------------------------------------------------------------------------
   Looks right:   COMMIT TRANSACTION;
   Does not:      ROLLBACK TRANSACTION;
   -------------------------------------------------------------------------- */


/* ==========================================================================
   AFTER THE PRE-SALE — back to $12.90 a meal.
   Run this on its own, once the offer has closed.

   UPDATE WebsiteProudcts
   SET BaseCartonPrice = 154.80
   WHERE Section = 'Meals' AND CartonQty = 12;
   ========================================================================== */
