import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false, // Desativa bodyParser padrão para receber arquivos
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const form = new formidable.IncomingForm({
    multiples: false,
    uploadDir: path.join(process.cwd(), 'public/transcripts'), // pasta pública
    keepExtensions: true,
  });

  try {
    await fs.promises.mkdir(path.join(process.cwd(), 'public/transcripts'), { recursive: true });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao processar upload' });
      }

      const file = files.file; // campo enviado como "file"
      const fileName = path.basename(file.filepath);
      const publicUrl = `/transcripts/${fileName}`;

      res.status(200).json({
        url: `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''}${publicUrl}`,
      });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro interno' });
  }
}
