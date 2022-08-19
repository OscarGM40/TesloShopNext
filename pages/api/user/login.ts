import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { UserModel } from '../../../models';
import bcrypt from 'bcryptjs';
import { jwt } from '../../../utils';

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
      return loginUser(req, res);
    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

async function loginUser(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { email = '', password = '' } = req.body;
  await db.connect();
  const user = await UserModel.findOne({ email: email });
  await db.disconnect();
  if (!user) {
    return res.status(400).json({ message: 'Bad credentials(email)' });
  }
  if (!bcrypt.compareSync(password, user.password!)) {
    return res.status(400).json({ message: 'Bad credentials(password)' });
  }
  const { role, name, _id } = user;
  const token = jwt.signToken(_id, email);

  return res.status(200).json({
    token,
    user: { email, role, name },
  });
}
