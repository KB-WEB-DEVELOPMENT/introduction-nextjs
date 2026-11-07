import { pgTable, serial, text, integer } from "drizzle-orm/pg-core"

export const blogs = pgTable("blogs", {
	id: serial("id").primarykey(),
	title: text("title").notNull(), // .unique() could be added
	author: text("author").notNull(),
	url: text("url").notNull(), // .unique() could be added
	likes: integer("likes").default(0),
})
