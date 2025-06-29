import { useState } from 'react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [gallery, setGallery] = useState([]);
  const [uploader, setUploader] = useState('');

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
    formData.append('uploader', uploader || 'Anonim');

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setMessage('Fotoğraf başarıyla yüklendi!');
      setGallery((prev) => [...prev, data.data]);
      setSelectedFile(null);
      setUploader('');
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
      <h1 style={{
        textAlign: 'center',
        fontFamily: "'Playfair Display', serif",
        fontSize: '2.5rem',
        color: '#b76e79',
        marginBottom: '0.5rem'
      }}>
        💍 Aleyna & Enes - Nişan Anı Albümü
      </h1>

      <p style={{ textAlign: 'center', marginBottom: '2rem', fontStyle: 'italic' }}>
        “Bu anları bizimle paylaştığınız için sonsuz teşekkürler...”
      </p>

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
            marginInline: 'auto'
          }}
        />
<input
  id="upload-input"
  type="file"
  accept="image/*"
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
        {gallery.map((item, i) => (
          <div key={i}
            style={{
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              backgroundColor: '#fff',
              transition: 'transform 0.3s, box-shadow 0.3s',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            }}
          >
            <img src={item.webContentLink} alt={`Anı ${i + 1}`} style={{ width: '100%' }} />
            <div style={{
              padding: '0.5rem 1rem',
              fontSize: '0.9rem',
              textAlign: 'center',
              backgroundColor: '#fff0f5',
              borderTop: '1px solid #fcdce1'
            }}>
              <p style={{ margin: 0 }}><strong>{item.uploader}</strong></p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>{item.timestamp}</p>
              <span style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontSize: '1.5rem',
                color: '#ff6b81',
              }}>❤️</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
