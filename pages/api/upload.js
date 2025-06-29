// pages/api/upload.js

import { google } from 'googleapis';
import formidable from 'formidable';
import fs from 'fs';

// Node.js API route'ları body parse etmemeli
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Yalnızca POST');

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parsing error:', err);
      return res.status(500).json({ error: 'Form parse hatası' });
    }

    const file = files.file;
    if (!file) return res.status(400).json({ error: 'Dosya bulunamadı' });

    try {
      // Kimlik doğrulama
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uris: ['http://localhost:3000'], // Vercel’de URL farklı olacak
        },
        scopes: ['https://www.googleapis.com/auth/drive.file'],
      });

      const authClient = await auth.getClient();
      const drive = google.drive({ version: 'v3', auth: authClient });

      // Dosyayı Google Drive'a yükle
      const fileMetadata = {
        name: file.originalFilename,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
      };

      const media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.filepath),
      };

      const response = await drive.files.create({
        resource: fileMetadata,
        media,
        fields: 'id, name, webViewLink, webContentLink',
      });

      return res.status(200).json({
        message: 'Fotoğraf yüklendi',
        data: response.data,
      });

    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ error: 'Yükleme sırasında hata' });
    }
  });
}
