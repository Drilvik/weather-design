const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'weather_app_super_secret_key_2026';
const DB_PATH = path.join(__dirname, 'db.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));

const readDB = () => {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], favorites: [] }, null, 2));
  }
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  const parsed = data ? JSON.parse(data) : {};
  return {
    users: Array.isArray(parsed.users) ? parsed.users : [],
    favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
  };
};

const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// Middleware для перевірки JWT-токена
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Немає токена авторизації' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Невалідний або прострочений токен' });
  }
};


я
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const finalName = (name || username || '').trim();

    if (!finalName || !email || !password) {
      return res.status(400).json({ message: 'Заповніть усі поля' });
    }

    const db = readDB();
    const existingUser = db.users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Користувач із таким email вже існує' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      name: finalName,
      email,
      password: hashedPassword,
      badge: 'Premium',
      tempUnit: 'C',
      windUnit: 'kmh',
      cityName: 'Ужгород',
      country: 'Україна',
      lat: '48.62',
      lon: '22.28',
      avatar: '',
    };

    db.users.push(newUser);
    writeDB(db);

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...safeUser } = newUser;

    res.status(201).json({ token, user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка сервера при реєстрації' });
  }
});


app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = readDB();
    const user = db.users.find((u) => u.email === email);

    if (!user) {
      return res.status(400).json({ message: 'Невірний email або пароль' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Невірний email або пароль' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...safeUser } = user;

    res.json({ token, user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка сервера при вході' });
  }
});


app.get('/api/users/me', authMiddleware, (req, res) => {
  const db = readDB();
  const user = db.users.find((u) => u.id === req.userId);
  if (!user) {
    return res.status(404).json({ message: 'Користувача не знайдено' });
  }

  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

app.put('/api/users/me', authMiddleware, (req, res) => {
  const db = readDB();
  const userIndex = db.users.findIndex((u) => u.id === req.userId);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'Користувача не знайдено' });
  }

  const { password, id, ...updates } = req.body;
  db.users[userIndex] = { ...db.users[userIndex], ...updates };
  writeDB(db);

  const { password: _, ...safeUser } = db.users[userIndex];
  res.json(safeUser);
});



app.get('/api/favorites', authMiddleware, (req, res) => {
  const db = readDB();
  const userFavorites = db.favorites.filter((f) => f.userId === req.userId);
  res.json(userFavorites);
});

// Додати місто в улюблені
app.post('/api/favorites', authMiddleware, (req, res) => {
  const db = readDB();
  const { name, cityName, country, lat, lon } = req.body;

  const newFav = {
    id: Date.now().toString(),
    userId: req.userId,
    name: name || cityName,
    cityName: cityName || name,
    country: country || '',
    lat: String(lat || 0),
    lon: String(lon || 0),
  };

  db.favorites.push(newFav);
  writeDB(db);

  res.status(201).json(newFav);
});


app.delete('/api/favorites/:id', authMiddleware, (req, res) => {
  const db = readDB();
  const initialLength = db.favorites.length;
  db.favorites = db.favorites.filter(
    (f) => !(f.id === req.params.id && f.userId === req.userId)
  );

  if (db.favorites.length === initialLength) {
    return res.status(404).json({ message: 'Місто не знайдено' });
  }

  writeDB(db);
  res.json({ message: 'Місто видалено' });
});


app.listen(PORT, () => {
  console.log(`Сервер успішно запущено на http://localhost:${PORT}`);
});