import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 4000;
const SECRET = 'changeme-secret'; // החלף לסביבה אמיתית
const DATA_PATH = './data.json';

app.use(cors());
app.use(bodyParser.json());

// קריאת הגדרות
app.get('/api/config', (req, res) => {
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, JSON.stringify({
      hebrewYoutubeUrl: '',
      englishYoutubeUrl: '',
      apkUrl: '',
      bydUrl: ''
    }));
  }
  const data = JSON.parse(fs.readFileSync(DATA_PATH));
  // שמירה לאחור - תמיכה בקבצים ישנים
  if (!('hebrewYoutubeUrl' in data)) data.hebrewYoutubeUrl = data.youtubeUrl || '';
  if (!('englishYoutubeUrl' in data)) data.englishYoutubeUrl = '';
  if (!('bydUrl' in data)) data.bydUrl = data.extraUrl || '';
  res.json(data);
});

// עדכון הגדרות (דורש התחברות)
app.post('/api/config', authenticateToken, (req, res) => {
  const { hebrewYoutubeUrl, englishYoutubeUrl, apkUrl, bydUrl } = req.body;
  fs.writeFileSync(DATA_PATH, JSON.stringify({ hebrewYoutubeUrl, englishYoutubeUrl, apkUrl, bydUrl }));
  res.json({ success: true });
});

// התחברות
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // משתמש דמו
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign({ username }, SECRET, { expiresIn: '2h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
