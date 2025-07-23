import { useEffect, useState } from 'react';

export default function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [uploader, setUploader] = useState('');
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const UPLOADCARE_PUBLIC_KEY = '11bc1127d609268ba8b8';

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setMessage('Lütfen fotoğraf seçin.');
      return;
    }

    setMessage('Yükleniyor...');

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append('UPLOADCARE_PUB_KEY', UPLOADCARE_PUBLIC_KEY);
      formData.append('UPLOADCARE_STORE', '1');
      formData.append('file', file);

      try {
        const res = await fetch('https://upload.uploadcare.com/base/', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (data.file) {
          const imageUrl = `https://ucarecdn.com/${data.file}/`;
          setGallery((prev) => [
            { image_url: imageUrl, uploader_name: uploader || 'Anonim' },
            ...prev,
          ]);
        }
      } catch (err) {
        console.error('Yükleme hatası:', err);
        setMessage('Yükleme sırasında hata oluştu.');
        return;
      }
    }

    setMessage('Tüm fotoğraflar başarıyla yüklendi!');
    setSelectedFiles([]);
    setUploader('');
    document.getElementById('upload-input').value = '';
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch('https://api.uploadcare.com/files/?ordering=-datetime_uploaded', {
        headers: {
          Accept: 'application/vnd.uploadcare-v0.7+json',
          Authorization: 'Uploadcare.Simple 11bc1127d609268ba8b8:a9174c05c67b00d287c5'
        }
      });

      const data = await res.json();
      const urls = data.results
        .filter(file => file.is_image && file.is_ready)
        .map(file => ({
          image_url: `https://ucarecdn.com/${file.uuid}/`,
          uploader_name: 'Anonim'
        }));

      setGallery(urls);
    } catch (err) {
      console.error('Uploadcare galeri alınamadı:', err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const romanticQuotes = [
    '💕 “Seninle her şey bir başka güzel.”',
    '📷 “Bu karede kalbim gülümsedi.”',
    '🌸 “Anılar, kalbin gizli çekmecesidir.”',
    '✨ “Bu albümde her şey aşkla yazıldı.”',
  ];

  return (
<div style={{
  textAlign: 'center',
  marginTop: '1rem',
  marginBottom: '2rem'
}}>
  <img
    src="/nisan.png"
    alt="Aleyna ve Enes"
    style={{
      maxHeight: '140px',
      height: 'auto',
      width: 'auto',
      objectFit: 'contain',
      border: 'none',
      boxShadow: 'none',
      borderRadius: '0'
    }}
  />
    </div>
    
  <p style={{
    marginTop: '0.5rem',
    fontSize: '0.95rem',
    fontStyle: 'italic',
    color: '#7a5c5c'
  }}>
    💞 14 Eylül 2025 • Paşa Garden
  </p>
</div>

      <h1 style={{
        textAlign: 'center',
        fontSize: '2.5rem',
        color: '#6b4f3b',
        marginBottom: '0.5rem',
        fontFamily: "'Handlee', cursive"
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
        color: '#7a5c5c',
        backgroundColor: '#fef8f5',
        borderLeft: '4px solid #d4a373',
        borderRadius: '8px',
      }}>
        “Bu özel günde attığımız ilk adımı sizlerle paylaşmak bizim için çok kıymetli.
        Her kare, sevgiyle dolu bir anı…”
      </p>

      <div style={{
        backgroundColor: '#fffaf3',
        border: '1px dashed #d4a373',
        padding: '0.75rem',
        borderRadius: '10px',
        margin: '1.5rem auto',
        maxWidth: '500px',
        fontSize: '0.85rem',
        color: '#6b4f3b',
        textAlign: 'left',
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
      }}>
        <h3 style={{ textAlign: 'center', fontSize: '1.1rem', marginBottom: '0.5rem' }}>📸 Fotoğraf Yükleme</h3>
        <ul style={{ paddingLeft: '1rem', lineHeight: '1.5', margin: 0 }}>
          <li>Adınızı yazın (isteğe bağlı)</li>
          <li>Fotoğraf(lar)ınızı seçin</li>
          <li>📤 Yükle butonuna tıklayın</li>
        </ul>
        <p style={{
          marginTop: '0.75rem',
          fontStyle: 'italic',
          fontSize: '0.8rem',
          textAlign: 'center'
        }}>
          💖 Her kare bir tebessüm...
        </p>
      </div>

    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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

  {/* Gizli dosya inputu */}
  <input
    id="upload-input"
    type="file"
    accept="image/*"
    multiple
    onChange={handleFileChange}
    style={{ display: 'none' }}
  />

  {/* 📤 İkonlu tıklanabilir alan */}
  <label htmlFor="upload-input" style={{
  display: 'inline-block',
  fontSize: '1.2rem', // önceki 2rem'di
  cursor: 'pointer',
  padding: '6px 12px', // daha zarif
  border: '1px dashed #d4a373',
  borderRadius: '8px',
  color: '#6b4f3b',
  fontWeight: '500',
  backgroundColor: '#d4a373',
  transition: '0.2s',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
}}
onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2e6'}
onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fffaf3'}
>
  🖼️ Fotoğrafları Seç
</label>

  <button onClick={handleUpload} style={{
    marginLeft: '1rem',
    backgroundColor: '#d4a373',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  }}>
    📤 Yükle
  </button>
</div>


      {message && <p style={{
        textAlign: 'center',
        fontWeight: 'bold',
        color: message.includes('başarı') ? '#28a745' : '#c0392b'
      }}>{message}</p>}

      <h2 style={{
        fontFamily: "'Great Vibes', cursive",
        fontSize: '1.8rem',
        textAlign: 'center',
        color: '#9c6f73',
        marginTop: '3rem'
      }}>💞 Kalpten Kareler</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '1rem',
        marginTop: '1rem',
        padding: '1rem'
      }}>
        {gallery.map((item, i) => (
          <div key={i}>
            {i > 0 && i % 4 === 0 && (
              <div style={{
                fontStyle: 'italic',
                fontSize: '0.9rem',
                color: '#a56363',
                backgroundColor: '#fffaf3',
                padding: '0.5rem',
                borderRadius: '8px',
                textAlign: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
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
        fontSize: '0.95rem'
      }}>
        💌 Sizden gelen her kare, bu hikâyenin bir parçası.  
        Paylaştığınız her an için teşekkür ederiz.
      </div>
    </div>
  );
}
