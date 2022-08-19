import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { IUser } from '../../../interfaces';
import { UserModel } from '../../../models';

type Data = 
| { message: string }
| IUser[]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return getUsers(req, res);
    case 'PUT':
      return updateUser(req, res);
    default:
      res.status(400).json({ message: 'Bad request' });
  }
}
const getUsers = async(req: NextApiRequest, res: NextApiResponse<Data>)=> {
  await db.connect();
  const users = await UserModel.find().select('-password').lean();
  await db.disconnect();
  
  return res.status(200).json(users)
}

// funcion para actualizar el role
const updateUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { userId = '', role = ''} = req.body;
  if(!isValidObjectId(userId)){ 
    return res.status(400).json({ message: 'Id no válido'})
  }
  const validRoles = ['admin','client','superuser','CEO']
  
  if(!validRoles.includes(role)){
    return res.status(400).json({ message: 'Rol no permitido' + validRoles.join(', ')})
  }
  
  await db.connect();
  const user = await UserModel.findById(userId);
  if(!user){
    return res.status(404).json({ message: 'Usuario no encontrado con id: ' + userId})
  }
  user.role = role;
  await user.save()
  await db.disconnect();

}

