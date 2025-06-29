// src/App.js
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [name, setName] = useState('');
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [images, setImages] = useState([]);

  // 📸 Fotoğrafları yükle
  const loadImages = async () => {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setImages(data);
    else console.error('Fotoğraflar alınamadı:', error.message);
  };

  useEffect(() => {
    loadImages();
  }, []);

  // 📤 Form submit işlemi
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!imageFile) return alert('Bir fotoğraf seçmelisin.');

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result;

      const { error } = await supabase.from('images').insert([
        {
          image_url: base64,
          uploader_name: name,
          caption: caption
        }
      ]);

      if (error) {
        alert('Yükleme hatası: ' + error.message);
      } else {
        alert('Fotoğraf yüklendi!');
        setName('');
        setCaption('');
        setImageFile(null);
        loadImages();
      }
    };
    reader.readAsDataURL(imageFile);
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Aleyna & Enes Anı Albümü 💛</h1>

      <form onSubmit={handleUpload} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Adınız"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />{' '}
        <br />
        <input
          type="text"
          placeholder="Kısa bir not (isteğe bağlı)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />{' '}
        <br />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          required
        />{' '}
        <br />
        <button type="submit">Fotoğrafı Yükle</button>
      </form>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
        {images.map((img) => (
          <div key={img.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '8px' }}>
            <img src={img.image_url} alt={img.caption} style={{ width: '200px', borderRadius: '6px' }} />
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              <strong>{img.uploader_name}</strong><br />
              <em>{img.caption}</em>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
