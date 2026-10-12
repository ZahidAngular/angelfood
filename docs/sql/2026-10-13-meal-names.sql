/* ==========================================================================
   Angel Food — the meal names as supplied, 13 October 2026

   Four meals are called something slightly fuller than the database has
   them. The website's own pages already use these names; this brings the
   catalogue into line, so that buy-now and the products page agree.

   Needed because buy-now reads this table. Until it runs, that page shows
   the shorter names while the rest of the site shows these.

   The other five are already correct and are left alone.

   Run against the AngelFood database. The transaction is left open: read the
   check at the bottom before committing.
   ========================================================================== */

SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRANSACTION;

UPDATE WebsiteProudcts SET Name = 'Tofu & Greens Bowl'                   WHERE Code = 'CMTS400G';
UPDATE WebsiteProudcts SET Name = 'Creamy Vege Korma'                    WHERE Code = 'CMVK400G';
UPDATE WebsiteProudcts SET Name = 'Savoury Plant-Based Mince & Mash'     WHERE Code = 'CMMM400G';
UPDATE WebsiteProudcts SET Name = 'Plant-Based Chicken Stir-Fry Noodles' WHERE Code = 'CMCN400G';

/* -------------------------------------------------------------------------
   Expect these nine, in this spelling:

     Creamy Butter Curry
     Creamy Vege Korma
     Plant-Based Chicken Stir-Fry Noodles
     Saag Tofu & Quinoa
     Savoury Plant-Based Mince & Mash
     Spiced Black Lentils & Rice
     Thai Green Tofu Curry
     Tofu & Greens Bowl
     Vege Lasagna

   The name has to match the site exactly: the "Ingredients & nutrition" link
   on each card is found by name, so a difference of one word is the
   difference between a link and no link.
   ------------------------------------------------------------------------- */

SELECT Code, Name, Image
FROM WebsiteProudcts
WHERE Section = 'Meals'
ORDER BY Name;

/* --------------------------------------------------------------------------
   Looks right:   COMMIT TRANSACTION;
   Does not:      ROLLBACK TRANSACTION;
   -------------------------------------------------------------------------- */
