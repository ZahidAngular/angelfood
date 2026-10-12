/* ==========================================================================
   Angel Food — meals update, 12 October 2026

   Three things, in one transaction:

     1. Repoints the four meals already on sale at their new photographs.
     2. Adds the five new meals.
     3. Moves the meal price from $11.90 to $12.90 a meal.

   The website reads this table directly, so it picks all of this up without a
   deploy. The image paths point at files that have to be live on the site
   already — they ship in the same release, so deploy the website first or the
   new rows will show a broken photograph until you do.

   Two things about this table that are easy to trip over:

     - It is called WebsiteProudcts, plural, with the letters of "Products"
       transposed. That is how the original migration created it and how the
       application still reads it, so it is spelled that way here too rather
       than corrected.

     - Prices are per carton, not per meal. The site divides baseCartonPrice
       by cartonQty, so $12.90 a meal is 12.90 x 12 = 154.80 a carton.

   Run against the AngelFood database. The transaction is left open on
   purpose: read the two checks at the bottom before committing.
   ========================================================================== */

SET NOCOUNT ON;
SET XACT_ABORT ON;   -- an error rolls everything back rather than leaving
                     -- half the meals updated

BEGIN TRANSACTION;

/* -------------------------------------------------------------------------
   1. New photographs for the meals already on sale
   ------------------------------------------------------------------------- */

UPDATE WebsiteProudcts SET Image = '/images/meals/butter-curry.webp'  WHERE Code = 'CMBC400G';
UPDATE WebsiteProudcts SET Image = '/images/meals/vege-lasagna.webp'  WHERE Code = 'CMLC400G';
UPDATE WebsiteProudcts SET Image = '/images/meals/tofu-greens.webp'   WHERE Code = 'CMTS400G';
UPDATE WebsiteProudcts SET Image = '/images/meals/vege-korma.webp'    WHERE Code = 'CMVK400G';

/* -------------------------------------------------------------------------
   2. The five new meals

   Codes follow the pattern already in the table: CM for a chilled meal, two
   letters for the dish, then the pack size. ProductOptionId 0 and
   BaseCartonLimit 2 match every existing row.

   FeedName is the name the stockist feed uses for the same product. These
   five are not in that feed yet, so it is set to the product name as a
   placeholder — correct it to whatever the warehouse calls them once they
   are listed, or the Where to Buy page will not match them.

   Each insert is guarded on its own code, so running this twice adds nothing
   the second time.
   ------------------------------------------------------------------------- */

INSERT INTO WebsiteProudcts
    (ProductOptionId, Section, Code, Name, FeedName, Weight, Image, CartonQty, BaseCartonPrice, BaseCartonLimit, PriceIncreasePercentage)
SELECT 0, 'Meals', 'CMMM400G', 'Savoury Mince & Mash', 'Savoury Mince & Mash',
       '400g', '/images/meals/mince-mash.webp', 12, 154.80, 2, 5.0
WHERE NOT EXISTS (SELECT 1 FROM WebsiteProudcts WHERE Code = 'CMMM400G');

INSERT INTO WebsiteProudcts
    (ProductOptionId, Section, Code, Name, FeedName, Weight, Image, CartonQty, BaseCartonPrice, BaseCartonLimit, PriceIncreasePercentage)
SELECT 0, 'Meals', 'CMBL400G', 'Spiced Black Lentils & Rice', 'Spiced Black Lentils & Rice',
       '400g', '/images/meals/black-lentils.webp', 12, 154.80, 2, 5.0
WHERE NOT EXISTS (SELECT 1 FROM WebsiteProudcts WHERE Code = 'CMBL400G');

INSERT INTO WebsiteProudcts
    (ProductOptionId, Section, Code, Name, FeedName, Weight, Image, CartonQty, BaseCartonPrice, BaseCartonLimit, PriceIncreasePercentage)
SELECT 0, 'Meals', 'CMST400G', 'Saag Tofu & Quinoa', 'Saag Tofu & Quinoa',
       '400g', '/images/meals/saag-tofu.webp', 12, 154.80, 2, 5.0
WHERE NOT EXISTS (SELECT 1 FROM WebsiteProudcts WHERE Code = 'CMST400G');

INSERT INTO WebsiteProudcts
    (ProductOptionId, Section, Code, Name, FeedName, Weight, Image, CartonQty, BaseCartonPrice, BaseCartonLimit, PriceIncreasePercentage)
SELECT 0, 'Meals', 'CMCN400G', 'Chicken Stir-Fry Noodles', 'Chicken Stir-Fry Noodles',
       '400g', '/images/meals/chicken-stir-fry.webp', 12, 154.80, 2, 5.0
WHERE NOT EXISTS (SELECT 1 FROM WebsiteProudcts WHERE Code = 'CMCN400G');

INSERT INTO WebsiteProudcts
    (ProductOptionId, Section, Code, Name, FeedName, Weight, Image, CartonQty, BaseCartonPrice, BaseCartonLimit, PriceIncreasePercentage)
SELECT 0, 'Meals', 'CMTG400G', 'Thai Green Tofu Curry', 'Thai Green Tofu Curry',
       '400g', '/images/meals/thai-green-curry.webp', 12, 154.80, 2, 5.0
WHERE NOT EXISTS (SELECT 1 FROM WebsiteProudcts WHERE Code = 'CMTG400G');

/* -------------------------------------------------------------------------
   3. $12.90 a meal

   Applied to every meal, including the four already listed, so one price
   holds across the range rather than the new dishes costing more than the
   old ones. Delete this statement if the rise is meant for the new meals
   only — they are already inserted at the new price above.

   The meat lines are left alone: a different carton size at $11.50 a unit,
   and raising those is a separate decision.
   ------------------------------------------------------------------------- */

UPDATE WebsiteProudcts
SET BaseCartonPrice = 154.80       -- 12.90 x 12
WHERE Section = 'Meals' AND CartonQty = 12;

/* -------------------------------------------------------------------------
   Check before committing

   Expect nine meals, each 400g, CartonQty 12, BaseCartonPrice 154.80, a
   per-meal price of 12.90, and an image under /images/meals/.
   ------------------------------------------------------------------------- */

SELECT
    Code,
    Name,
    Weight,
    CartonQty,
    BaseCartonPrice,
    CAST(BaseCartonPrice / NULLIF(CartonQty, 0) AS DECIMAL(10, 2)) AS PricePerMeal,
    Image
FROM WebsiteProudcts
WHERE Section = 'Meals'
ORDER BY Name;

/* Nothing left pointing at a photograph that has been deleted. Expect no rows. */
SELECT Code, Name, Image
FROM WebsiteProudcts
WHERE Image LIKE '%-v3.webp';

/* --------------------------------------------------------------------------
   If both look right:        COMMIT TRANSACTION;
   If anything looks wrong:   ROLLBACK TRANSACTION;

   Nothing above is saved until one of those is run.
   -------------------------------------------------------------------------- */
