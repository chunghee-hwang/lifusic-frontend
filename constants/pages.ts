import { UserRole } from './constants';

const LOGIN_PAGE = {
  URL: '/auth/login-page',
  ROLE: 'ALL',
};
const LOGOUT_PAGE = {
  URL: '/auth/logout-page',
  ROLE: 'ALL',
};
const SIGNUP_PAGE = {
  URL: '/auth/signup-page',
  ROLE: 'ALL',
};
const UNAUTHORIZED_PAGE = {
  URL: '/403',
  ROLE: 'ALL',
};
const CHECK_USER_DATA_PAGE = { URL: '/auth/check-user-data-page', ROLE: 'ALL' };
const MUSIC_ADMIN_CONSOLE_PAGE = {
  URL: '/management/musics',
  ROLE: UserRole.ADMIN,
};
const MUSIC_ADD_PAGE = { URL: '/management/add-music', ROLE: UserRole.ADMIN };
const MUSIC_SEARCH_PAGE = { URL: '/service/musics', ROLE: UserRole.CUSTOMER };
const MUSIC_PLAYLIST_PAGE = {
  URL: '/service/playlist',
  ROLE: UserRole.CUSTOMER,
};

export default {
  LOGIN_PAGE,
  LOGOUT_PAGE,
  SIGNUP_PAGE,
  CHECK_USER_DATA_PAGE,
  MUSIC_ADMIN_CONSOLE_PAGE,
  MUSIC_ADD_PAGE,
  MUSIC_SEARCH_PAGE,
  MUSIC_PLAYLIST_PAGE,
  UNAUTHORIZED_PAGE,
};
