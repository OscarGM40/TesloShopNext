import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { dbUsers } from '../../../database';

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Credentials({
      // nuestra custom auth
      name: 'Custom Login',
      credentials: {
        email: {
          label: 'Correo',
          type: 'email',
          placeholder: 'correo@gmail.com',
        },
        password: {
          label: 'Contraseña',
          type: 'password',
          placeholder: 'Password',
        },
      },
      // authorize debe devolver algo(un objeto o null para el fallo)
      // y puedo devolver lo que quiera
      async authorize(credentials) {
        return await dbUsers.checkUserEmailPassword(
          credentials!.email,
          credentials!.password
        );
      },
    }),
  ],
  // specify to Next my custom pages for login and register(it is a must)
  pages:{
    signIn:'/auth/login',
    newUser:'/auth/register'
  },
  // overwritte the session default settings
  session:{
    maxAge:2592000, // 30 days
    strategy:'jwt',
    updateAge: 86400 // every day it updates
  },
  // Callbacks
  callbacks: {
    // normalmente son asincronas jwt y session
    async jwt({ token, account, user }) {
      // esta callback recibe el token y me permite realizar algo,pero despues debo devolverlo de nuevo
      if (account) {
        token.accessToken = account.accessToken;
        switch (account.type) {
          case 'oauth':
            // verificar si existe y si no crearlo
            token.user = await dbUsers.oAuthToDbUser(
              user?.email || '',
              user?.name || ''
            );
            break;
          case 'credentials':
            token.user = user;
            break;
        }
      }
      return token;
    },
    // y de forma similar esta cb debe retornar la session,aunque permite manipulaciones antes de hacerlo
    async session({ session, token, user }) {
      session.accessToken = token.acessToken;
      session.user = token.user as any;
      return session;
    },
  },
});
