type CommonResponse = {
  success: boolean;
};

type LoginRequest = {
  email: string;
  password: string;
};

type LoginSuccessResponse = {
  token: string;
};

type Role = 'admin' | 'customer';

type SignUpRequest = {
  email: string;
  name: string;
  password: string;
  role: Role;
};

type SignUpRequestForm = {
  email: string;
  name: string;
  password: string;
  passwordConfirm: string;
  role: Role;
};

type UserData = {
  id: number;
  email: string;
  name: string;
  role: Role;
};

type UserContext = {
  isLogin: boolean;
  logout: Function;
  isUserDataLoading: boolean;
  userData?: UserData | null;
};

type OrderDirection = 'asc' | 'desc';

type ArtistMusic = {
  id: number;
  name: string;
  thumbnailImageUrl?: string | null;
};

type SearchArtistMusicRequest = {
  keyword?: string;
  orderBy?: 'name';
  orderDirection?: OrderDirection;
  limit?: number;
  page?: number;
};

type SearchArtistMusicResponse = {
  totalPage: number;
  page: number;
  musics: Array<ArtistMusic>;
};

type AddMusicRequest = {
  musicName: string;
  musicFile: any;
  thumbnailImageFile: any;
};

type SearchedMusic = {
  id: number;
  name: string;
  artistName: string;
  thumbnailImageUrl?: string | null;
};

type MusicOrderBy = 'name' | 'artistName';

type SearchMusicRequest = {
  keyword?: string;
  orderBy?: MusicOrderBy;
  orderDirection?: OrderDirection;
  limit?: number;
  page?: number;
};

type SearchMusicResponse = {
  totalPage: number;
  page: number;
  musics: Array<SearchedMusic>;
};

type Playlist = {
  id: number;
  name?: string | null;
  createdAt: number;
};

type CreatePlaylistRequest = {
  name?: string; // 플레이리스트 이름
};

type CreatePlaylistResponse = {
  playlistId: number;
  name: string;
};

type GetAllPlaylistResponse = Array<Playlist>;

type AddMusicToPlaylistRequest = {
  musicId: number;
  playlistId: number;
};

type GetMusicsInPlaylistRequest = {
  playlistId: number;
  orderBy?: MusicOrderBy;
  orderDirection?: OrderDirection;
};

type MusicInPlaylist = {
  musicInPlaylistId: number;
  musicId: number;
  fileId: number;
  musicName: string;
  artistName: string;
  thumbnailImageUrl?: string | null;
};

type GetMusicsInPlaylistResponse = Array<MusicInPlaylist>;

type DeleteMusicsInPlaylistRequest = {
  musicInPlaylistIds: Array<number>;
};
