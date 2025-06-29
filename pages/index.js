// pages/index.js

import { useState } from 'react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage('Lütfen bir fotoğraf seçin.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      setMessage('Fotoğraf başarıyla yüklendi!');
      setSelectedFile(null);
      document.getElementById('upload-input').value = '';
    } else {
      setMessage('Yükleme başarısız.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📸 Enes & Aleyna - Anı Albümü</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input
          id="upload-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <button type="submit" style={{ marginLeft: '1rem' }}>Yükle</button>
      </form>

      {message && <p>{message}</p>}

      {/* Bu alanı ileride Drive'dan fotoğrafları çekip listeleyecek şekilde geliştireceğiz */}
      <h2>🎞️ Albüm</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
        {images.map((img, i) => (
          <img key={i} src={img} style={{ width: '100%', borderRadius: '8px' }} />
        ))}
      </div>
    </div>
  );
}
