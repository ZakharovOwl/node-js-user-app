const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const pgp = require('pg-promise')();
const db = pgp('postgres://node-test:password123@localhost:5432/node-test');

db.connect()
.then(obj => {
	console.log('DB success');
	obj.done();
})
.catch(error => {
	// Ошибка подключения к базе данных
	console.error('DB error:', error);
});

app.use(express.json());

// Добавление пользователя
app.post('/users', async (req, res) => {
	try {
		const { name, age } = req.body;
		const newUser = await db.one('INSERT INTO users(name, age) VALUES($1, $2) RETURNING *', [name, age]);
		res.json(newUser);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Получение всех пользователей
app.get('/users', async (req, res) => {
	try {
		const users = await db.any('SELECT * FROM users');
		res.json(users);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Получение пользователя по ID
app.get('/users/:id', async (req, res) => {
	const userId = req.params.id;
	try {
		const user = await db.one('SELECT * FROM users WHERE id = $1', userId);
		res.json(user);
	} catch (error) {
		res.status(404).json({ error: 'User cant be find' });
	}
});

// Удаление пользователя по ID
app.delete('/users/:id', async (req, res) => {
	const userId = req.params.id;
	try {
		const result = await db.result('DELETE FROM users WHERE id = $1', userId);
		if (result.rowCount === 1) {
			res.json({ message: 'User is removed' });
		} else {
			res.status(404).json({ error: 'User cant be find' });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.listen(port, () => {
	console.log(`Server is ok ${port}`);
});
