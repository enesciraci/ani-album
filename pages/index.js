import { useState } from 'react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [gallery, setGallery] = useState([]);

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
      const data = await res.json();
      setMessage('Fotoğraf başarıyla yüklendi!');
      setGallery((prev) => [...prev, data.data.webContentLink]);
      setSelectedFile(null);
      document.getElementById('upload-input').value = '';
    } else {
      setMessage('Yükleme başarısız oldu.');
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #fff0f5 0%, #ffe4e1 100%)',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: "'Segoe UI', 'Quicksand', sans-serif",
      color: '#4d4d4d',
    }}>
      <img 
        src="https://i.ibb.co/zfwMCHG/flower-header-pastel.png" 
        alt="Çiçek Başlık" 
        style={{ 
          width: '100%', 
          maxHeight: '200px', 
          objectFit: 'cover', 
          marginBottom: '1rem',
          borderRadius: '12px'
        }} 
      />

      <h1 style={{
        textAlign: 'center',
        fontFamily: "'Playfair Display', serif",
        fontSize: '2.5rem',
        color: '#b76e79',
        marginBottom: '0.5rem'
      }}>
        💍 Enes & Aleyna - Anı Albümü
      </h1>

      <p style={{ textAlign: 'center', marginBottom: '2rem', fontStyle: 'italic' }}>
        “Bu anları bizimle paylaştığınız için sonsuz teşekkürler...”
      </p>

      <form onSubmit={handleSubmit} style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <input
          id="upload-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{
            padding: '10px',
            border: '2px dashed #ffb6c1',
            borderRadius: '10px',
            background: '#fff',
            cursor: 'pointer',
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
          fontWeight: 'bold'
        }}>
          📤 Yükle
        </button>
      </form>

      {message && <p style={{
        textAlign: 'center',
        fontWeight: 'bold',
        color: message.includes('başarı') ? '#28a745' : '#c0392b'
      }}>{message}</p>}

      <h2 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.8rem',
        textAlign: 'center',
        color: '#9c6f73',
        marginTop: '3rem'
      }}>🎞️ Albüm</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '1rem',
        marginTop: '1rem',
        padding: '1rem'
      }}>
        {gallery.map((url, i) => (
          <div key={i} style={{
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            backgroundColor: '#fff'
          }}>
            <img src={url} alt={`Anı ${i + 1}`} style={{ width: '100%' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
