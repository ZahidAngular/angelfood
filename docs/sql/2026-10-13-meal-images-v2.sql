/* ==========================================================================
   Angel Food — point the meals at the versioned photographs, 13 October 2026

   Optional, and safe to leave for a quiet moment. The site works either way:
   both /images/meals/<name>.webp and /images/meals/<name>-v2.webp serve the
   same picture today.

   What it buys you: the plain filename has been rewritten half a dozen times
   as the photographs were adjusted, so anyone who looked at the page during
   that stretch may hold an older copy and keep seeing it until their browser
   lets go. A URL nobody has requested before cannot be stale, so moving to
   the -v2 names clears that for everyone at once.

   Images are now served with a five minute cache rather than an hour, so
   future changes to the same filename appear quickly without this step.

   Run against the AngelFood database. The transaction is left open: read the
   check at the bottom before committing.
   ========================================================================== */

SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRANSACTION;

UPDATE WebsiteProudcts SET Image = '/images/meals/butter-curry-v2.webp'     WHERE Code = 'CMBC400G';
UPDATE WebsiteProudcts SET Image = '/images/meals/vege-lasagna-v2.webp'     WHERE Code = 'CMLC400G';
UPDATE WebsiteProudcts SET Image = '/images/meals/tofu-greens-v2.webp'      WHERE Code = 'CMTS400G';
UPDATE WebsiteProudcts SET Image = '/images/meals/vege-korma-v2.webp'       WHERE Code = 'CMVK400G';
UPDATE WebsiteProudcts SET Image = '/images/meals/mince-mash-v2.webp'       WHERE Code = 'CMMM400G';
UPDATE WebsiteProudcts SET Image = '/images/meals/black-lentils-v2.webp'    WHERE Code = 'CMBL400G';
UPDATE WebsiteProudcts SET Image = '/images/meals/saag-tofu-v2.webp'        WHERE Code = 'CMST400G';
UPDATE WebsiteProudcts SET Image = '/images/meals/chicken-stir-fry-v2.webp' WHERE Code = 'CMCN400G';
UPDATE WebsiteProudcts SET Image = '/images/meals/thai-green-curry-v2.webp' WHERE Code = 'CMTG400G';

/* Expect nine meals, every Image ending -v2.webp. */
SELECT Code, Name, Image
FROM WebsiteProudcts
WHERE Section = 'Meals'
ORDER BY Name;

/* --------------------------------------------------------------------------
   Looks right:   COMMIT TRANSACTION;
   Does not:      ROLLBACK TRANSACTION;
   -------------------------------------------------------------------------- */
