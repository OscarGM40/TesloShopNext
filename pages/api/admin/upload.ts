import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
// import fs from 'fs';

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data = {
  message: string;
};
// especificar a Next que no parsee el body de la request
export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'POST': {
      return uploadFile(req, res);
    }
    default: {
      return res.status(404).json({ message: 'Bad request' });
    }
  }
}

const saveFile = async (file: formidable.File): Promise<string> => {
  // FORMA CON SUBIDA AL FILE SYSTEM
  /*   const data = fs.readFileSync(file.filepath);
  fs.writeFileSync(`./public/${file.originalFilename}`,data)
  fs.unlinkSync(file.filepath)
  return; */

  const data = await cloudinary.uploader.upload(file.filepath, {
    folder: 'teslo-shop',
  });
  // solo quiero la secure_url asi que la extraigo
  const { secure_url } = data;
  return secure_url;
};

const parseFiles = async (req: NextApiRequest): Promise<string> => {
  return new Promise((resolve, reject) => {
    // new formidable.IncomingForm().parse(req,cb(err,fields,files)) es el primer paso
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) return reject(err);

      const filePath = await saveFile(files.file as formidable.File);
      resolve(filePath);
    });
  });
};

const uploadFile = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const imgUrl = await parseFiles(req);
  return res.status(200).json({ message: imgUrl });
};
