import { useState } from 'react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

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
      setMessage('Yükleme başarısız oldu.');
    }
  };

  return (
    <div style={{
      backgroundColor: '#fff5f8',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: "'Quicksand', sans-serif"
    }}>
      <img src="/header-flower.png" alt="Çiçek Başlık" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', marginBottom: '1rem' }} />
      <h1 style={{ textAlign: 'center', fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: '1rem' }}>
        📸 Enes & Aleyna - Anı Albümü
      </h1>

      <form onSubmit={handleSubmit} style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <input
          id="upload-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{
            padding: '10px',
            border: '2px dashed #ffb3c1',
            borderRadius: '10px',
            background: '#fff',
            cursor: 'pointer',
          }}
        />
        <button type="submit" style={{
          marginLeft: '1rem',
          backgroundColor: '#ffb3c1',
          color: 'white',
          border: 'none',
          padding: '10px 16px',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          Yükle
        </button>
      </form>

      {message && <p style={{ textAlign: 'center', fontWeight: 'bold' }}>{message}</p>}

      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem' }}>🎞️ Albüm</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '1rem',
        marginTop: '1rem'
      }}>
        {/* Fotoğraflar burada listelenecek */}
      </div>
    </div>
  );
}
