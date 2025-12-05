CREATE TABLE `users` (
	`userId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userName` text NOT NULL,
	`userEmail` text NOT NULL,
	`userPassword` text NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_userEmail_unique` ON `users` (`userEmail`);