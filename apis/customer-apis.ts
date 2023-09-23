import axios from '@/constants/axios';

export const SEARCH_MUSIC = async (
  request: SearchMusicRequest
): Promise<SearchMusicResponse> => {
  const response = await axios.get('/api/music/list', {
    params: request,
  });
  return response.data;
};

export const CREATE_PLAYLIST = async (
  request: CreatePlaylistRequest
): Promise<CreatePlaylistResponse> => {
  const response = await axios.post('/api/music/playlist', request);
  return response.data;
};

export const GET_ALL_PLAYLIST = async (): Promise<GetAllPlaylistResponse> => {
  const response = await axios.get('/api/music/playlist/all');
  return response.data;
};

export const ADD_MUSIC_TO_PLAYLIST = async (
  request: AddMusicToPlaylistRequest
): Promise<CommonResponse> => {
  const response = await axios.put('/api/music/playlist/one');
  return response.data;
};

export const GET_MUSICS_IN_PLAYLIST = async (
  request: GetMusicsInPlaylistRequest
): Promise<GetMusicsInPlaylistResponse> => {
  const response = await axios.get(
    `/api/music/playlist/${request.playlistId}`,
    {
      params: {
        ...(request.orderBy && {
          orderBy: request.orderBy,
        }),
        ...(request.orderDirection && {
          orderDirection: request.orderDirection,
        }),
      },
    }
  );
  return response.data;
};

export const GET_MUSIC_STREAM_URL = (musicFileId: number): string => {
  return `/api/file/${musicFileId}/stream`;
};

export const DELETE_MUSICS_IN_PLAYLIST = async (
  request: DeleteMusicsInPlaylistRequest
): Promise<CommonResponse> => {
  const response = await axios.post(
    `/api/music/playlist/batchDeleteMusics`,
    request
  );
  return response.data;
};
