import { db } from '.';
import { UserModel } from '../models';
import bcrypt from 'bcryptjs';

export const checkUserEmailPassword = async (
  email: string,
  password: string
) => {
  await db.connect();
  const user = await UserModel.findOne({ email: email });
  await db.disconnect();

  if (!user) {
    return null;
  }
  if (!bcrypt.compareSync(password, user.password!)) {
    return null;
  }

  const { role, name, _id } = user;
  return {
    _id,
    email: email.toLowerCase(),
    role,
    name,
  };
};

// esta funcion crea o verifica el usuario de OAuth
export const oAuthToDbUser = async (oAuthEmail: string, oAuthName: string) => {
  await db.connect();
  const user = await UserModel.findOne({ email: oAuthEmail });
  if (user) {
    await db.disconnect();
    const { role, name, email, _id } = user;
    return { _id, email, role, name };
  }
  const newUser = new UserModel({
    email: oAuthEmail,
    name: oAuthName,
    password: '@', // solo queremos un caracter que de fallo
    role: 'client',
  });
  await newUser.save();
  await db.disconnect();

  const { role, name, email, _id } = newUser;
  return { _id, email, role, name };
};
