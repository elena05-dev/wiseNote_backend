import { ONE_DAY } from '../constants/index.js';

export const setupSession = (res, session) => {
  console.log('Setting session:', session);

  res.cookie('sessionId', session._id.toString(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: ONE_DAY,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: ONE_DAY,
  });
};
