-- created_at used to be stored in whole seconds, so orders placed within
-- the same second had no reliable order. Convert existing rows to
-- milliseconds (values below 10^11 are still in seconds).
UPDATE `users` SET `created_at` = `created_at` * 1000 WHERE `created_at` < 100000000000;
--> statement-breakpoint
UPDATE `orders` SET `created_at` = `created_at` * 1000 WHERE `created_at` < 100000000000;
