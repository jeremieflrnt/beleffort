/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const getSessionToken = (req: any): string => {
  let sessionToken = '';
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL === '1') {
    const secureSessionTokenCookie = req.cookies['__Secure-next-auth.session-token'];
    if (secureSessionTokenCookie) sessionToken = secureSessionTokenCookie;
    else console.log('Missing secure session token in cookies');
  } else {
    const sessionTokenCookie = req.cookies['next-auth.session-token'];
    if (sessionTokenCookie) sessionToken = sessionTokenCookie;
    else console.log('Missing session token in cookies');
  }
  return sessionToken;
};
