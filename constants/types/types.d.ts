import {
  Client,
  StompHeaders,
  StompSubscription,
  messageCallbackType,
} from '@stomp/stompjs';

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
  allMusicSize: number;
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
  musicFileId: number;
  thumbnailImageUrl?: string | null;
};

type MusicOrderBy = 'name' | 'artistName' | string;

type SearchMusicRequest = {
  keyword?: string;
  orderBy?: MusicOrderBy;
  orderDirection?: OrderDirection;
  limit?: number;
  page?: number;
};

type SearchMusicResponse = {
  allMusicSize: number;
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

type AuthContextValue = {
  isLogin: boolean;
  logout: Function;
  isUserDataLoading: boolean;
  userData?: UserData | null;
};

type StompContextValue = {
  subscribe?: (
    destination: string,
    callback: messageCallbackType,
    headers?: StompHeaders
  ) => StompSubscription | undefined | null;
  unsubscribe?: (subscription: StompSubscription) => void;
  isConnected: boolean;
};

type HeadCell = {
  id: string;
  content: any;
  sortable: boolean;
};

type Column = {
  id: number | string;
  content: any;
  style?: object;
};

type Row = {
  id: number;
  columns: Column[];
};

type SortableTableProps = {
  limit: number; // 한 페이지당 몇 개 보여줄 건지
  setLimit: (limit: number) => void;
  page: number; // 현재 페이지
  setPage: (page: number) => void;
  orderBy: string; // 정렬할 항목
  setOrderBy: (orderBy: string) => void;
  orderDirection: OrderDirection; // 오름차순 or 내림차순
  setOrderDirection: (orderDirection: OrderDirection) => void;
  isSelectable: boolean; // 선택 가능한 표 여부
  selected?: Set<number>; // 선택된 항목의 아이디
  setSelected?: (selected: Set<number>) => void;
  headCells: HeadCell[]; // 헤더에 보여줄 컬럼들
  rows: Row[]; // 항목들
  totalRowsCount: number; // 전체 항목 개수
};
