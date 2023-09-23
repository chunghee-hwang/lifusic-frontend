import axios from '@/constants/axios';

export const GET_MY_MUSICS = async (
  request: any //SearchArtistMusicRequest
): Promise<SearchArtistMusicResponse> => {
  const response = await axios.get('/api/admin/musics', {
    params: request,
  });
  return response.data;
};

export const GET_DOWNLOAD_MUSIC_URL = (musicId: number): string => {
  return `/api/admin/music/${musicId}/file`;
};

export const DELETE_MUSIC = async (
  musicId: number
): Promise<CommonResponse> => {
  const response = await axios.delete(`/api/admin/music/${musicId}`);
  return response.data;
};

export const ADD_MUSIC = async (
  request: AddMusicRequest
): Promise<CommonResponse> => {
  const response = await axios.post('/api/admin/music', request);
  return response.data;
};
