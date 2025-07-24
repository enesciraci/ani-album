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

  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
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
    <div>
      {/* Başlık görseli */}
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <img
          src="/nisan.png"
          alt="Aleyna ve Enes"
          style={{
            maxHeight: '100px',
            objectFit: 'contain',
            border: 'none',
            boxShadow: 'none',
            borderRadius: '0',
            marginBottom: '0'
          }}
        />
      </div>

      {/* Sayfa başlığı */}
      <h1 style={{
        textAlign: 'center',
        fontSize: '2.8rem',
        color: '#6b4f3b',
        marginTop: '-8px',
        marginBottom: '0.2rem',
        fontFamily: "'Alex Brush', cursive"
      }}>
        Aleyna❤︎Enes
      </h1>

      <p style={{
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto 2rem',
        padding: '1rem',
        fontStyle: 'italic',
        fontSize: '1rem',
        color: '#7a5c5c',
        backgroundColor: '#f6efe7',
        borderLeft: '4px solid #d4a373',
        borderRadius: '8px',
      }}>
        “Bu özel günde attığımız ilk adımı sizlerle paylaşmak bizim için çok kıymetli.
        Her kare, sevgiyle dolu bir anı…”
      </p>

      {/* Seçilen dosyaların önizlemesi */}
      {selectedFiles.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}>
          {selectedFiles.map((file, index) => (
            <div key={index} style={{
              position: 'relative',
              width: '80px',
              height: '80px',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              border: '1px solid #e3c5a8'
            }}>
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <button
                onClick={() => removeSelectedFile(index)}
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: '#b23c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  lineHeight: '1',
                  padding: '0'
                }}
              >×</button>
            </div>
          ))}
        </div>
      )}

      {/* Fotoğraf yükleme alanı */}
      <div style={{
        maxWidth: '500px',
        margin: '0 auto 2rem',
        backgroundColor: '#fff8f2',
        border: '1px solid #e7c7aa',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        textAlign: 'center'
      }}>
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
            width: '100%',
            fontSize: '1rem',
          }}
        />

        <input
          id="upload-input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <label htmlFor="upload-input" style={{
          display: 'inline-block',
          fontSize: '0.95rem',
          cursor: 'pointer',
          padding: '6px 12px',
          border: '1px dashed #d4a373',
          borderRadius: '6px',
          color: '#6b4f3b',
          fontWeight: '500',
          backgroundColor: '#fceedd',
          boxShadow: 'inset 0 0 0 1px #f3d2b3',
          marginRight: '0.5rem',
          minWidth: '130px',
          textAlign: 'center'
        }}>
          🖼️ Fotoğrafları Seç
        </label>

        <button onClick={handleUpload} style={{
          display: 'inline-block',
          fontSize: '0.95rem',
          cursor: 'pointer',
          padding: '6px 12px',
          border: '1px dashed #d4a373',
          borderRadius: '6px',
          color: '#6b4f3b',
          fontWeight: '500',
          backgroundColor: '#fceedd',
          boxShadow: 'inset 0 0 0 1px #f3d2b3',
          minWidth: '130px',
          textAlign: 'center'
        }}>
          📤 Yükle
        </button>
      </div>

      {message && <p style={{
        textAlign: 'center',
        fontWeight: 'bold',
        color: message.includes('başarı') ? '#28a745' : '#c0392b'
      }}>{message}</p>}

      {/* Albüm başlığı */}
      <h2 style={{
        fontFamily: "'Alex Brush', cursive",
        fontSize: '1.8rem',
        textAlign: 'center',
        color: '#9c6f73',
        marginTop: '1rem'
      }}>⁠❥ Kalpten Kareler</h2>

      {/* Galeri */}
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

      {/* Büyütülmüş görüntü */}
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

      {/* Alt metin */}
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
