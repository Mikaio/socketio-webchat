CREATE TABLE `rooms` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`name` varchar(25),
	`user_id` int NOT NULL);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`username` varchar(25));
--> statement-breakpoint
ALTER TABLE `rooms` ADD CONSTRAINT `rooms_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;