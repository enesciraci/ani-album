// src/App.js
import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';

export default function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [gallery, setGallery] = useState([]);
  const [uploader, setUploader] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const galleryRef = useRef(null); // Galeriye odaklanmak için

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setGallery(data);
    else console.error('Veri alınamadı:', error.message);
  };

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
      fetchImages();
      setTimeout(() => {
        galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err) {
      setMessage('Bazı fotoğraflar yüklenemedi: ' + err.message);
    }
  };

  const romanticQuotes = [
    '💕 “Seninle her şey bir başka güzel.”',
    '📷 “Bu karede kalbim gülümsedi.”',
    '🌸 “Anılar, kalbin gizli çekmecesidir.”',
    '✨ “Bu albümde her şey aşkla yazıldı.”',
  ];

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
        “14 Eylül 2025... Birlikte çıktığımız bu yolda ilk adımın anıları burada birikti.
        Her karede biraz heyecan, biraz kahkaha, çokça sevgi var.
        Bu sayfada yalnızca fotoğraflar değil; kalplerimiz de paylaşılıyor.”
      </p>

      {/* Kılavuz Kutusu */}
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
          <li>Fotoğraf(lar)ınız birkaç saniye içinde galeriye eklenecek</li>
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

      {/* Yükleme Formu */}
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

      {/* Galeri Başlığı */}
      <h2
        ref={galleryRef}
        style={{
          fontFamily: "'Great Vibes', cursive",
          fontSize: '1.8rem',
          textAlign: 'center',
          color: '#9c6f73',
          marginTop: '3rem'
        }}
      >
        📸 Anılarımızdan Birkaç Sayfa
      </h2>

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
              <img
                src={item.image_url}
                alt={`Anı ${i + 1}`}
                loading="lazy"
                style={{ width: '100%', borderRadius: '4px' }}
              />
              <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#555' }}>
                <strong>{item.uploader_name}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Büyütme Modali */}
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
