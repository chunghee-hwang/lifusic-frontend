import axios from '@/constants/axios';
import {
  SearchArtistMusicResponse,
  CommonResponse,
  AddMusicRequest,
  SearchArtistMusicRequest,
} from '@/constants/types/types';

export const GET_MY_MUSICS = async (
  request: SearchArtistMusicRequest
): Promise<SearchArtistMusicResponse> => {
  const response = await axios.get('/api/admin/musics', {
    params: request,
  });
  return response.data;
};

export const GET_DOWNLOAD_MUSIC_URL = (musicId: number): string => {
  return `${process.env.NEXT_PUBLIC_API_HOST}/api/admin/music/${musicId}/file`;
};

export const DELETE_MUSICS = async (
  musicIds: number[]
): Promise<CommonResponse> => {
  const response = await axios.post('/api/admin/music/deleteBatch', {
    musicIds: musicIds ?? [],
  });
  return response.data;
};

export const ADD_MUSIC = async (
  request: AddMusicRequest
): Promise<CommonResponse> => {
  const formData = new FormData();
  Object.entries(request).forEach(([key, value]) => {
    if (value) {
      formData.append(key, value);
    }
  });
  const response = await axios.post('/api/admin/music', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
