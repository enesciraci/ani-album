// src/App.js
import { useState } from 'react';

export default function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [uploader, setUploader] = useState('');
  const [message, setMessage] = useState('');

  const CLOUD_NAME = 'dwwlpbmja'; // ← Cloudinary hesabın
  const UPLOAD_PRESET = 'aleynaenesalbum'; // ← Cloudinary'de oluşturduğun preset

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return setMessage('Lütfen fotoğraf seçin.');

    setMessage('Yükleniyor...');
    const uploadedUrls = [];

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();

        uploadedUrls.push({
          url: data.secure_url,
          uploader: uploader || 'Anonim',
        });
      } catch (err) {
        console.error('Yükleme hatası:', err);
        setMessage('Yükleme sırasında hata oluştu.');
        return;
      }
    }

    setGallery((prev) => [...uploadedUrls, ...prev]);
    setMessage('Tüm fotoğraflar başarıyla yüklendi!');
    setSelectedFiles([]);
    setUploader('');
    document.getElementById('file-input').value = '';
  };

  const romanticQuotes = [
    '💕 “Seninle her sey bir baska guzel.”',
    '📷 “Bu karede kalbim gulumsedi.”',
    '🌸 “Anilar, kalbin gizli cekmecesidir.”',
    '✨ “Bu albumde her sey askla yazildi.”',
  ];

  return (
    <div style={{
      backgroundImage: 'url("https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freevector.com%2Fflower-background-vector-30140&psig=AOvVaw3yI_sjCIR1q5u0SZ83rrUh&ust=1751289467470000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNDUhevblo4DFQAAAAAdAAAAABAE)',
      backgroundRepeat: 'repeat',
      backgroundSize: 'contain',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: "'Great Vibes', cursive",
      color: '#4d4d4d',
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
        💌 Enes & Aleyna — 14 Eylul 2025, Istanbul
      </div>

      <h1 style={{
        textAlign: 'center',
        fontSize: '2.5rem',
        color: '#b76e79',
        marginBottom: '0.5rem',
        fontFamily: "'Great Vibes', cursive"
      }}>
        💍 Aleyna & Enes - Nisan Ani Albumu
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
        “14 Eylul 2025... Birlikte ciktigimiz bu yolda ilk adimin anilari burada birikti.
        Her karede biraz heyecan, biraz kahkaha, cokca sevgi var.
        Bu sayfada yalnizca fotograflar degil; kalplerimiz de paylasiliyor.”
      </p>

      {/* Form */}
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

      <h2 style={{
        fontFamily: "'Great Vibes', cursive",
        fontSize: '1.8rem',
        textAlign: 'center',
        color: '#9c6f73',
        marginTop: '3rem'
      }}>📸 Anılarımızdan Birkaç Sayfa</h2>

      {/* Galeri */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '1rem',
        marginTop: '1rem',
        padding: '1rem'
      }}>
        {gallery.map((item, i) => (
          <div key={item.id}>
            {i > 0 && i % 4 === 0 && (
              <div style={{
                fontStyle: 'italic',
                fontSize: '0.9rem',
                color: '#a56363',
                backgroundColor: '#fffafc',
                padding: '0.5rem',
                borderRadius: '8px',
                textAlign: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                fontFamily: "'Quicksand', sans-serif"
              }}>
                {romanticQuotes[Math.floor(Math.random() * romanticQuotes.length)]}
              </div>
            )}

            <div
              style={{
                background: '#fff',
                padding: '12px',
                borderRadius: '12px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                border: '1px solid #ddd',
                textAlign: 'center',
                fontFamily: "'Great Vibes', cursive",
                width: '160px',
                transform: `rotate(${i % 2 === 0 ? '-2deg' : '2deg'})`,
                cursor: 'pointer'
              }}
              onClick={() => setSelectedImage(item.image_url)}
            >
              <img src={item.image_url} alt={`Anı ${i + 1}`} style={{ width: '100%', borderRadius: '4px' }} />
              <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#555' }}>
                <strong>{item.uploader_name}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

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

      <div style={{
        marginTop: '3rem',
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#7a5c5c',
        fontSize: '0.95rem',
        fontFamily: "'Quicksand', sans-serif"
      }}>
        💌 Sizden gelen her kare, bu hikâyenin bir parçası.  
        Paylaştığınız her an için teşekkür ederiz.
      </div>
    </div>
  );
}
