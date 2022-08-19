import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { UserModel } from '../../../models';
import bcrypt from 'bcryptjs';
import { jwt, validations } from '../../../utils';

type Data =
  | { message: string }
  | { token: string; user: { email: string; role: string; name: string } };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;

  switch (method) {
    case 'POST':
      return registerUser(req, res);
    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

async function registerUser(req: NextApiRequest, res: NextApiResponse<Data>) {
  const {
    email = '',
    password = '',
    name = '',
  } = req.body as { email: string; password: string; name: string };

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: 'La contraseña debe de tener minimo 6 caracteres' });
  }
  if (name.length < 3) {
    return res
      .status(400)
      .json({ message: 'El nombre debe de tener minimo 3 caracteres' });
  }

   if(!validations.isValidEmail(email)){
    return res.status(400).json({ message: 'El correo no es válido' });
  } 

  await db.connect();
  const user = await UserModel.findOne({ email: email });
  if (user) {
    return res.status(400).json({ message: 'Email ya registrado!' });
  }
  const newUser = new UserModel({
    email: email.toLowerCase(),
    password: bcrypt.hashSync(password),
    role: 'client',
    name,
  });

  try {
    await newUser.save({ validateBeforeSave: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Revisar logs del servidor' });
  }

  const { _id, role } = newUser;
  const token = jwt.signToken(_id, email);
  await db.disconnect();

  return res.status(201).json({
    token,
    user: {
      email,
      role,
      name,
    },
  });
}
