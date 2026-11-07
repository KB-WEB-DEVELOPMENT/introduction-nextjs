import { pgTable, serial, text, integer, boolean, varchar } from "drizzle-orm/pg-core"

export const blogs = pgTable("blogs", {
	id: serial("id").primarykey(),
	title: text("title").unique().notNull(),
	url: text("url").notNull(),
	likes: integer("likes").default(0),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id),
})

export const users = pgTable("users", {
	id: serial("id").primarykey(),
	username: text("username").unique().notNull(),
	name: text("name").notNull(),
	passwordHash: text("password_hash").notNull(.default(""),
	token: varchar('token', { length: 256 }).unique(),
})

export const readingList = pgTable("readingList", {
	id: serial("id").primarykey(),
	userId: integer("user_id").notNull(),
	blogId: integer("blog_id").notNull(),
	read: boolean("read").default(false).notNull(), 
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