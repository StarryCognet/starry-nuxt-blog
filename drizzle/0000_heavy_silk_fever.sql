CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user` text NOT NULL,
	`msg` text NOT NULL,
	`likes` integer DEFAULT 0,
	`created_at` integer NOT NULL
);
