import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Dialog, TextField, Typography, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import DownloadIcon from '@mui/icons-material/Download';
import AppsIcon from '@mui/icons-material/Apps';

const translations = {
  he: {
    title: 'הדרכת לקוחות',
    adminLogin: 'התחברות לניהול',
    username: 'שם משתמש',
    password: 'סיסמה',
    login: 'התחבר',
    adminPanel: 'ממשק ניהול',
    hebrewYoutube: 'קישור YouTube (עברית)',
    englishYoutube: 'קישור YouTube (אנגלית)',
    apk: 'קישור לאפליקציית Splashtop',
    byd: 'קישור לאפליקציית BYD accessibility',
    save: 'שמור',
    error: 'שגיאה בכניסה',
    downloadSplashtop: 'הורד אפליקציה Splashtop',
    downloadBYD: 'הורד אפליקציה BYD accessibility',
    lang: 'עברית',
    switchLang: 'English'
  },
  en: {
    title: 'Customer Guide',
    adminLogin: 'Admin Login',
    username: 'Username',
    password: 'Password',
    login: 'Login',
    adminPanel: 'Admin Panel',
    hebrewYoutube: 'YouTube Link (Hebrew)',
    englishYoutube: 'YouTube Link (English)',
    apk: 'Splashtop App Link',
    byd: 'BYD accessibility App Link',
    save: 'Save',
    error: 'Login error',
    downloadSplashtop: 'Download Splashtop App',
    downloadBYD: 'Download BYD accessibility App',
    lang: 'English',
    switchLang: 'עברית'
  }
};

const STORAGE_KEY = 'remotecontrol_config';

const defaultConfig = {
  hebrewYoutubeUrl: 'https://www.youtube.com/embed/0usUUlSCoAQ',
  englishYoutubeUrl: 'https://www.youtube.com/embed/0usUUlSCoAQ',
  apkUrl: 'https://play.google.com/store/apps/details?id=com.splashtop.remote.pad.v2',
  bydUrl: 'https://play.google.com/store/apps/details?id=com.byd.operatorapp'
};

function App() {
  const [lang, setLang] = useState('he');
  const [config, setConfig] = useState(defaultConfig);
  const [adminOpen, setAdminOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [form, setForm] = useState(config);
  const [login, setLogin] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const savedConfig = localStorage.getItem(STORAGE_KEY);
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
        setForm(parsedConfig);
      } catch (e) {
        console.error('Failed to parse config:', e);
      }
    }
  }, []);

  const handleAdminClick = () => {
    if (login.username === 'admin' && login.password === '123456') {
      setAdminOpen(true);
      setLoginOpen(false);
    } else {
      setLoginOpen(true);
    }
  };

  const handleLogin = () => {
    if (login.username === 'admin' && login.password === '123456') {
      setLoginOpen(false);
      setAdminOpen(true);
      setError('');
    } else {
      setError(translations[lang].error);
    }
  };

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      setConfig(form);
      setAdminOpen(false);
    } catch (e) {
      console.error('Failed to save config:', e);
    }
  };

  const handleLangChange = (event, newLang) => {
    if (newLang) setLang(newLang);
  };

  return (
    <Box dir={lang === 'he' ? 'rtl' : 'ltr'} sx={{
      minHeight: '100vh',
      p: 2,
      fontFamily: 'inherit',
      background: 'linear-gradient(135deg, #e3f0ff 0%, #fafcff 100%)',
      boxSizing: 'border-box'
    }}>
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}>
        <ToggleButtonGroup
          value={lang}
          exclusive
          onChange={handleLangChange}
          size="small"
        >
          <ToggleButton value="he">עברית</ToggleButton>
          <ToggleButton value="en">English</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 2 }}>
        <IconButton onClick={handleAdminClick} color="primary" sx={{ bgcolor: '#fff', boxShadow: 1 }}>
          <PersonIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Paper elevation={4} sx={{ width: '100%', maxWidth: 500, mx: 2, p: { xs: 2, sm: 4 }, borderRadius: 4, boxShadow: 6, textAlign: 'center', backdropFilter: 'blur(3px)' }}>
          <Typography variant="h3" fontWeight={700} gutterBottom color="primary.main" sx={{ mb: 3 }}>
            {translations[lang].title}
          </Typography>
          {config.hebrewYoutubeUrl && (
            <Box sx={{ my: 2, borderRadius: 3, overflow: 'hidden', boxShadow: 2 }}>
              <iframe
                width="100%"
                height="315"
                src={(lang === 'he' ? config.hebrewYoutubeUrl : config.englishYoutubeUrl)}
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: 12 }}
              />
            </Box>
          )}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: 2, my: 3 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              href={config.apkUrl}
              target="_blank"
              disabled={!config.apkUrl}
              startIcon={<AppsIcon />}
              sx={{ borderRadius: 3, fontWeight: 600, fontSize: 18, minWidth: 200, py: 2 }}
            >
              {translations[lang].downloadSplashtop}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              href={config.bydUrl}
              target="_blank"
              disabled={!config.bydUrl}
              startIcon={<DownloadIcon />}
              sx={{ borderRadius: 3, fontWeight: 600, fontSize: 18, minWidth: 200, py: 2 }}
            >
              {translations[lang].downloadBYD}
            </Button>
          </Box>
        </Paper>
      </Box>
      <Dialog open={loginOpen} onClose={() => setLoginOpen(false)}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">{translations[lang].adminLogin}</Typography>
          <TextField
            label={translations[lang].username}
            fullWidth
            margin="normal"
            value={login.username}
            onChange={e => setLogin({ ...login, username: e.target.value })}
          />
          <TextField
            label={translations[lang].password}
            type="password"
            fullWidth
            margin="normal"
            value={login.password}
            onChange={e => setLogin({ ...login, password: e.target.value })}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleLogin}>
            {translations[lang].login}
          </Button>
        </Paper>
      </Dialog>
      <Dialog open={adminOpen} onClose={() => setAdminOpen(false)}>
        <Paper sx={{ p: 3, minWidth: 350 }}>
          <Typography variant="h6">{translations[lang].adminPanel}</Typography>
          <TextField
            label={translations[lang].hebrewYoutube}
            fullWidth
            margin="normal"
            value={form.hebrewYoutubeUrl}
            onChange={e => setForm({ ...form, hebrewYoutubeUrl: e.target.value })}
          />
          <TextField
            label={translations[lang].englishYoutube}
            fullWidth
            margin="normal"
            value={form.englishYoutubeUrl}
            onChange={e => setForm({ ...form, englishYoutubeUrl: e.target.value })}
          />
          <TextField
            label={translations[lang].apk}
            fullWidth
            margin="normal"
            value={form.apkUrl}
            onChange={e => setForm({ ...form, apkUrl: e.target.value })}
          />
          <TextField
            label={translations[lang].byd}
            fullWidth
            margin="normal"
            value={form.bydUrl}
            onChange={e => setForm({ ...form, bydUrl: e.target.value })}
          />
          <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSave}>
            {translations[lang].save}
          </Button>
        </Paper>
      </Dialog>
    </Box>
  );
}

export default App;
