import { pqTable, serial, text, integer } from "drizzle-orm/pg-core"

export const blogs = pgTable("blogs", {
	id: serial("id").primarykey(),
	title: text("title").notNull(), // could add .unique()
	url: text("url").notNull(),  // could add .unique()
	likes: integer("likes").default(0),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id),
})

export const users = pgTable("users", {
	id: serial("id").primarykey(),
	username: text("username").unique().notNull(), 
	name: text("name").notNull(),
})


export const usersRelations = relations(users, ({ many }) => ({
    blogs: many(blogs),
}))

export const blogsRelations = relations(blogs, ({ many }) => ({
    user: one(users, {    
        fields: [blogs.userId],
        references: [blogs.id],	
    }),
}))