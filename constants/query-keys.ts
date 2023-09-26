import { SearchArtistMusicRequest, SearchMusicRequest } from './types/types';

// 유저 정보
export const USER_KEY = ['user'];

// 아티스트가 업로드한 음악들
export const MY_MUSIC = (request?: SearchArtistMusicRequest) => [
  'MY_MUSIC',
  {
    ...request,
  },
];

// 고객이 검색한 음악
export const SEARCHED_MUSIC = (request?: SearchMusicRequest) => [
  'SEARCHED_MUSIC',
  {
    ...request,
  },
];

// 고객의 플레이리스트 목록 (음악 목록 아님)
export const PLAYLISTS = ['PLAYLISTS'];

// 고객의 플레이리스트 안에 있는 음악
export const MUSICS_IN_PLAYLIST = (request?: SearchMusicRequest) => [
  'MUSICS_IN_PLAYLIST',
  {
    ...request,
  },
];

// 음악 하나
export const ONE_MUSIC = (musicId: number) => [
  'ONE_MUSIC',
  {
    musicId,
  },
];
