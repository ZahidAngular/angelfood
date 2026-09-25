/*
    Angel Food — meals to $11.90 each
    ---------------------------------
    The client's ordering page quotes $11.90 a meal. The website divides
    BaseCartonPrice by CartonQty to get that figure, so the price lives here
    and not in the site's code: 12 x 11.90 = 142.80 a carton.

    Meat is left alone deliberately — it is not sold online at the moment, and
    what it costs is a separate decision.

    Safe to run more than once: it only touches rows that aren't already right.

    Run against the AngelFood database.
*/

SET NOCOUNT ON;

BEGIN TRANSACTION;

UPDATE  dbo.WebsiteProudcts
SET     BaseCartonPrice = CartonQty * 11.90
WHERE   Section = 'Meals'
  AND   CartonQty > 0
  AND   BaseCartonPrice <> CartonQty * 11.90;

PRINT CONCAT(@@ROWCOUNT, ' meal row(s) repriced.');

COMMIT TRANSACTION;

-- What the site will now show.
SELECT  Section,
        Code,
        Name,
        CartonQty,
        BaseCartonPrice,
        CAST(BaseCartonPrice / NULLIF(CartonQty, 0) AS decimal(10, 2)) AS PricePerMeal
FROM    dbo.WebsiteProudcts
ORDER BY Section, WebsiteProudctId;
