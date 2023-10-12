import express from "express";
import { MikroORM } from "@mikro-orm/core";
import mikroOrmConfig from "./mikro-orm.config";
import { User } from "./user.entity";

(async () => {
	const orm = await MikroORM.init(mikroOrmConfig);
	await orm.getMigrator().up(); // getMigrator

	if (await orm.isConnected()) {
		console.log("Connected to the database");
		const app = express();
		const port = process.env.PORT || 3000;

		app.use(express.json());

		// Add user
		app.post("/users", async (req, res) => {
			try {
				const { name, age } = req.body;
				const em = orm.em.fork(); // Создаем локальный экземпляр EntityManager
				const userRepository = em.getRepository(User);
				const newUser = userRepository.create({ name, age });
				await userRepository.persistAndFlush(newUser);
				res.json(newUser);
			} catch (error: any) {
				res.status(500).json({ error: error.message });
			}
		});

		// Get all users
		app.get("/users", async (req, res) => {
			const em = orm.em.fork();
			const userRepository = em.getRepository(User);
			const users = await userRepository.findAll();
			res.json(users);
		});

		// Get user
		app.get("/users/:id", async (req, res) => {
			const userId = req.params.id;
			const em = orm.em.fork();
			const userRepository = em.getRepository(User);
			// @ts-ignore
			const user = await userRepository.findOne(userId);
			if (user) {
				res.json(user);
			} else {
				res.status(404).json({ error: "User cant be found" });
			}
		});

		// Remove user
		app.delete("/users/:id", async (req, res) => {
			const userId = req.params.id;
			const em = orm.em.fork();
			const userRepository = em.getRepository(User);
			// @ts-ignore
			const user: any = await userRepository.findOne(userId);
			if (user) {
				userRepository.remove(user);
				await userRepository.flush();
				res.json({ message: "User is removed" });
			} else {
				res.status(404).json({ error: "User cant be found" });
			}
		});

		app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	} else {
		console.error("Failed to connect to the database.");
	}
})();
