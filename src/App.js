import { useEffect, useState } from 'react';

export default function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [uploader, setUploader] = useState('');
  const [caption, setCaption] = useState('');
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCaption, setSelectedCaption] = useState('');

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
    const name = uploader || 'Anonim';
    const note = caption || '';

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
            { image_url: imageUrl, uploader_name: name, caption: note },
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
    setCaption('');
    document.getElementById('upload-input').value = '';
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch('https://api.uploadcare.com/files/?ordering=-datetime_uploaded', {
        headers: {
          Accept: 'application/vnd.uploadcare-v0.7+json',
          Authorization: 'Uploadcare.Simple 11bc1127d609268ba8b8:a9174c05c67b00d287c5',
        },
      });

      const data = await res.json();
      const urls = data.results
        .filter((file) => file.is_image && file.is_ready)
        .map((file) => ({
          image_url: `https://ucarecdn.com/${file.uuid}/`,
          uploader_name: 'Anonim',
          caption: '',
        }));

      setGallery(urls);
    } catch (err) {
      console.error('Uploadcare galeri alınamadı:', err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#fffaf3', minHeight: '100vh' }}>
      {/* Başlık */}
      <div style={{ textAlign: 'center', padding: '1rem' }}>
        <img src="/nisan.png" alt="Aleyna ve Enes" style={{ maxHeight: '100px' }} />
        <h1 style={{
          fontFamily: "'Alex Brush', cursive",
          fontSize: '2.8rem',
          color: '#6b4f3b',
          marginTop: '-8px',
        }}>
          Aleyna❤︎Enes
        </h1>
        <p style={{
          fontStyle: 'italic',
          color: '#7a5c5c',
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#f6efe7',
          padding: '1rem',
          borderLeft: '4px solid #d4a373',
          borderRadius: '8px',
          marginTop: '-8px'  
        }}>
          “Bu özel günü birlikte ölümsüzleştirelim.”
        </p>
      </div>

      {/* Seçilen fotoğraf önizleme */}
      {selectedFiles.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0.75rem',
          margin: '1rem auto'
        }}>
          {selectedFiles.map((file, index) => (
            <div key={index} style={{
              position: 'relative',
              width: '80px',
              height: '80px',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #e3c5a8'
            }}>
              <img src={URL.createObjectURL(file)} alt="preview" style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }} />
              <button onClick={() => removeSelectedFile(index)} style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: '#b23c3c',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                cursor: 'pointer'
              }}>×</button>
            </div>
          ))}
        </div>
      )}

      {/* Yükleme kutusu */}
      <div style={{
        maxWidth: '500px',
        margin: '0 auto',
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
            padding: '10px 12px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            width: '100%',
            fontSize: '1rem'
          }}
        />
        <input
          type="text"
          placeholder="Anı notu (isteğe bağlı)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          style={{
            marginBottom: '1rem',
            padding: '10px 12px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            width: '100%',
            fontSize: '1rem'
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
          marginRight: '1rem',
          padding: '8px 16px',
          backgroundColor: '#fceedd',
          border: '1px dashed #d4a373',
          borderRadius: '6px',
          cursor: 'pointer'
        }}>🖼️ Fotoğrafları Seç</label>
        <button onClick={handleUpload} style={{
          padding: '8px 16px',
          backgroundColor: '#fceedd',
          border: '1px dashed #d4a373',
          borderRadius: '6px',
          cursor: 'pointer'
        }}>📤 Yükle</button>
        {message && <p style={{
          marginTop: '1rem',
          fontWeight: 'bold',
          color: message.includes('başarı') ? '#28a745' : '#c0392b'
        }}>{message}</p>}
      </div>

      {/* Galeri */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '1rem',
        marginTop: '2rem',
        padding: '1rem'
      }}>
        {gallery.map((item, i) => (
          <div key={i} onClick={() => {
            setSelectedImage(item.image_url);
            setSelectedCaption(item.caption || '');
          }} style={{
            background: '#fff',
            padding: '12px',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
            border: '1px solid #ddd',
            textAlign: 'center',
            width: '160px',
            cursor: 'pointer'
          }}>
            <img src={item.image_url} alt="Albüm" style={{ width: '100%', borderRadius: '4px' }} />
            <div style={{ fontSize: '0.8rem', marginTop: '4px' }}><strong>{item.uploader_name}</strong></div>
          </div>
        ))}
      </div>

      {/* Büyütülmüş Görsel */}
      {selectedImage && (
        <div onClick={() => setSelectedImage(null)} style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          flexDirection: 'column'
        }}>
          <img src={selectedImage} alt="Büyütülmüş" style={{
            maxWidth: '90%',
            maxHeight: '80%',
            borderRadius: '12px',
            marginBottom: '1rem',
            boxShadow: '0 0 15px rgba(255,255,255,0.8)'
          }} />
          {selectedCaption && <p style={{
            color: '#fff',
            fontStyle: 'italic',
            fontSize: '1rem',
            maxWidth: '80%',
            textAlign: 'center'
          }}>{selectedCaption}</p>}
        </div>
      )}

      {/* Alt Yazı */}
      <div style={{
        textAlign: 'center',
        marginTop: '3rem',
        fontStyle: 'italic',
        color: '#7a5c5c'
      }}>
        💌 Sizden gelen her kare, bu hikâyenin bir parçası.  
        Paylaştığınız her an için teşekkür ederiz.
      </div>
    </div>
  );
}
