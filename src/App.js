// src/App.js
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { supabase } from './supabaseClient';
import AlbumPage from './AlbumPage';

function HomePage() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [uploader, setUploader] = useState('');

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return setMessage('Lütfen bir veya birden fazla fotoğraf seçin.');

    const uploads = selectedFiles.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          const base64Image = reader.result;
          const { error } = await supabase.from('images').insert([{
            image_url: base64Image,
            uploader_name: uploader || 'Anonim',
            caption: '',
          }]);

          if (error) reject(error);
          else resolve();
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    try {
      await Promise.all(uploads);
      setMessage('Tüm fotoğraflar başarıyla yüklendi!');
      setUploader('');
      setSelectedFiles([]);
      document.getElementById('upload-input').value = '';
    } catch (err) {
      setMessage('Bazı fotoğraflar yüklenemedi: ' + err.message);
    }
  };

  return (
    <div style={{
      backgroundColor: '#fff0f5',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: "'Great Vibes', cursive",
      color: '#4d4d4d'
    }}>
      <div style={{
        textAlign: 'center',
        fontSize: '0.9rem',
        backgroundColor: '#ffe4e1',
        padding: '0.5rem',
        borderRadius: '6px',
        marginBottom: '1rem',
        color: '#a14c5c',
        fontWeight: 'bold'
      }}>
        💌 Enes & Aleyna — 14 Eylül 2025, İstanbul
      </div>

      <h1 style={{
        textAlign: 'center',
        fontSize: '2.5rem',
        color: '#b76e79',
        marginBottom: '0.5rem'
      }}>
        💍 Aleyna & Enes - Nişan Anı Albümü
      </h1>

      <p style={{
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto 2rem',
        padding: '1rem',
        fontStyle: 'italic',
        fontSize: '1rem',
        color: '#5a5a5a',
        backgroundColor: '#fff8fb',
        borderLeft: '4px solid #ffb6c1',
        borderRadius: '8px',
        fontFamily: "'Quicksand', sans-serif"
      }}>
        Bu sayfada anılarınızı yükleyebilirsiniz. Galerimizi görmek için aşağıdaki butonu kullanın 💞
      </p>

      <div style={{
        backgroundColor: '#fffafc',
        border: '2px dashed #ffb6c1',
        padding: '1rem',
        borderRadius: '12px',
        margin: '2rem auto',
        maxWidth: '600px',
        fontFamily: "'Quicksand', sans-serif",
        color: '#a14c5c',
        textAlign: 'left',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ textAlign: 'center', fontSize: '1.3rem', marginBottom: '1rem' }}>📸 Fotoğraf Nasıl Yüklenir?</h3>
        <ol style={{ paddingLeft: '1.2rem', lineHeight: '1.8' }}>
          <li><strong>Adınızı yazın</strong> (isteğe bağlı)</li>
          <li><strong>Bir veya daha fazla fotoğraf seçin</strong></li>
          <li><strong>📤 Yükle</strong> butonuna tıklayın</li>
        </ol>
        <p style={{
          marginTop: '1rem',
          fontStyle: 'italic',
          fontSize: '0.95rem',
          textAlign: 'center'
        }}>
          💖 “Her kare bir hatıra, her yükleme bir tebessüm...”
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Adınız (isteğe bağlı)"
          value={uploader}
          onChange={(e) => setUploader(e.target.value)}
          style={{
            marginBottom: '1rem',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            width: '80%',
            maxWidth: '400px',
            display: 'block',
            marginInline: 'auto',
            fontFamily: "'Quicksand', sans-serif"
          }}
        />
        <input
          id="upload-input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          style={{
            display: 'inline-block',
            padding: '12px 16px',
            backgroundColor: '#fff0f5',
            border: '2px dashed #ffb6c1',
            borderRadius: '12px',
            color: '#b76e79',
            fontWeight: 'bold',
            fontFamily: "'Quicksand', sans-serif",
            cursor: 'pointer',
            transition: 'all 0.3s ease-in-out',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        />
        <button type="submit" style={{
          marginLeft: '1rem',
          backgroundColor: '#ffb6c1',
          color: 'white',
          border: 'none',
          padding: '10px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontFamily: "'Quicksand', sans-serif"
        }}>
          📤 Yükle
        </button>
      </form>

      {message && <p style={{
        textAlign: 'center',
        fontWeight: 'bold',
        color: message.includes('başarı') ? '#28a745' : '#c0392b',
        fontFamily: "'Quicksand', sans-serif"
      }}>{message}</p>}

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/album" style={{
          display: 'inline-block',
          backgroundColor: '#ffe4e1',
          padding: '12px 20px',
          borderRadius: '12px',
          fontWeight: 'bold',
          color: '#b76e79',
          textDecoration: 'none',
          fontFamily: "'Quicksand', sans-serif",
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          📁 Foto Albüme Git
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/album" element={<AlbumPage />} />
      </Routes>
    </Router>
  );
}
