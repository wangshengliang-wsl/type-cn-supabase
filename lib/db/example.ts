// Drizzle ORM 使用示例
// 这个文件展示了如何在项目中使用Drizzle ORM

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { db } from './index';
// import { users } from './schema'; // 当你定义了表结构后取消注释

// 示例：查询用户
// export async function getUsers() {
//   try {
//     const allUsers = await db.select().from(users);
//     return allUsers;
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     throw error;
//   }
// }

// 示例：创建用户
// export async function createUser(userData: NewUser) {
//   try {
//     const newUser = await db.insert(users).values(userData).returning();
//     return newUser[0];
//   } catch (error) {
//     console.error('Error creating user:', error);
//     throw error;
//   }
// }

// 示例：根据ID查询用户
// export async function getUserById(id: number) {
//   try {
//     const user = await db.select().from(users).where(eq(users.id, id));
//     return user[0];
//   } catch (error) {
//     console.error('Error fetching user by id:', error);
//     throw error;
//   }
// }

export {}; // 确保这是一个模块