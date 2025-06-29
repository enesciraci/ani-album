// src/App.js
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [gallery, setGallery] = useState([]);
  const [uploader, setUploader] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // 💡 Yeni eklendi

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Veri alınamadı:', error.message);
    } else {
      setGallery(data);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage('Lütfen bir fotoğraf seçin.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = reader.result;

      const { error } = await supabase.from('images').insert([
        {
          image_url: base64Image,
          uploader_name: uploader || 'Anonim',
          caption: '',
        },
      ]);

      if (error) {
        setMessage('Yükleme başarısız oldu: ' + error.message);
      } else {
        setMessage('Fotoğraf başarıyla yüklendi!');
        setUploader('');
        setSelectedFile(null);
        document.getElementById('upload-input').value = '';
        fetchImages();
      }
    };
    reader.readAsDataURL(selectedFile);
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '1rem',
        marginTop: '1rem',
        padding: '1rem'
      }}>
        {gallery.map((item, i) => (
          <div key={item.id}
            style={{
              background: '#fff',
              padding: '12px',
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              border: '1px solid #ddd',
              textAlign: 'center',
              fontFamily: "'Courier New', Courier, monospace",
              width: '160px',
              transform: `rotate(${i % 2 === 0 ? '-2deg' : '2deg'})`,
              cursor: 'pointer'
            }}
            onClick={() => setSelectedImage(item.image_url)}
          >
            <img src={item.image_url} alt={`Anı ${i + 1}`} style={{ width: '100%', borderRadius: '4px' }} />
            <div style={{
              marginTop: '8px',
              fontSize: '0.8rem',
              color: '#555'
            }}>
              <strong>{item.uploader_name}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* 💡 Modal (Büyütülmüş Fotoğraf) */}
      {selectedImage && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Büyütülmüş"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              borderRadius: '12px',
              boxShadow: '0 0 15px rgba(255,255,255,0.8)'
            }}
          />
        </div>
      )}
    </div>
  );
}
