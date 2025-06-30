import { useState, useEffect } from 'react';

export default function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [uploader, setUploader] = useState('');
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const CLOUD_NAME = 'dwwlpbmja'; // kendi Cloudinary cloud ismin
  const UPLOAD_PRESET = 'aleynaenesalbum'; // unsigned upload preset
  const FOLDER_NAME = 'album'; // Cloudinary'de görsellerin olduğu klasör

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch(
        `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${FOLDER_NAME}.json`
      );
      if (!res.ok) throw new Error('Listeleme başarısız.');
      const data = await res.json();
      const formatted = data.resources.map((item) => ({
        image_url: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${item.public_id}.${item.format}`,
        uploader_name: 'Ziyaretçi',
      }));
      setGallery(formatted);
    } catch (error) {
      console.error('Albüm verisi çekilemedi:', error.message);
      setMessage('Albüm yüklenemedi.');
    }
  };

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
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', FOLDER_NAME);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!data.secure_url) throw new Error('Yükleme başarısız.');
      } catch (err) {
        console.error('Yükleme hatası:', err);
        setMessage('Yükleme sırasında hata oluştu.');
        return;
      }
    }

    setMessage('Fotoğraflar başarıyla yüklendi!');
    setSelectedFiles([]);
    document.getElementById('upload-input').value = '';
    fetchGallery();
  };

  const romanticQuotes = [
    '💕 “Seninle her şey bir başka güzel.”',
    '📷 “Bu karede kalbim gülümsedi.”',
    '🌸 “Anılar, kalbin gizli çekmecesidir.”',
    '✨ “Bu albümde her şey aşkla yazıldı.”',
  ];

  return (
    <div style={{ backgroundColor: '#fff0f5', minHeight: '100vh', padding: '2rem', fontFamily: "'Quicksand', sans-serif" }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', color: '#b76e79' }}>
        💍 Aleyna & Enes - Nişan Anı Albümü
      </h1>

      <div style={{ textAlign: 'center', margin: '1rem auto' }}>
        <input
          id="upload-input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          style={{ display: 'block', margin: '1rem auto' }}
        />
        <button onClick={handleUpload} style={{
          padding: '10px 20px',
          background: '#ffb6c1',
          border: 'none',
          borderRadius: '8px',
          color: '#fff',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          📤 Yükle
        </button>
      </div>

      {message && (
        <p style={{ textAlign: 'center', color: message.includes('başarı') ? 'green' : 'red' }}>{message}</p>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '1rem',
        marginTop: '2rem'
      }}>
        {gallery.map((item, i) => (
          <div key={i} style={{
            background: '#fff',
            padding: '12px',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
            border: '1px solid #ddd',
            textAlign: 'center',
            width: '100%',
            cursor: 'pointer',
            transform: `rotate(${i % 2 === 0 ? '-2deg' : '2deg'})`,
          }}
            onClick={() => setSelectedImage(item.image_url)}
          >
            <img src={item.image_url} alt={`foto ${i}`} style={{ width: '100%', borderRadius: '8px' }} />
            <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#555' }}>{item.uploader_name}</div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <img
            src={selectedImage}
            style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '12px' }}
            alt="Büyütülmüş"
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
