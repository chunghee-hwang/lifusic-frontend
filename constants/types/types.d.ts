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
  playlistId?: number;
  orderBy?: MusicOrderBy;
  orderDirection?: OrderDirection;
};

type MusicInPlaylist = {
  musicInPlaylistId?: number;
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
  style?: object;
};

type SortableTableProps = {
  limit?: number; // 한 페이지당 몇 개 보여줄 건지
  setLimit?: (limit: number) => void;
  page?: number; // 현재 페이지
  setPage?: (page: number) => void;
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
  usePagination: boolean; // 페이지네이션 사용 여부
};

// 플레이리스트 컨텍스트 타입
type MusicPlaylistContextValue = {
  defaultPlaylist: Playlist | null; // 기본 플레이리스트
  musicsInPlaylist: MusicInPlaylist[]; // 플레이리스트에 들어있는 음악 정보
  isFetchingMusics: boolean; // 음악을 불러오는 중인지
  isFetchMusicError: boolean; // 음악 불러오다가 에러 발생 여부
  playlistMusicOrderBy: 'name' | 'artist' | string; // 플레이리스트에 있는 음악 정렬 필드
  setPlaylistMusicOrderBy: (order: string) => void;
  playlistMusicOrderDirection: OrderDirection; // 플레이리스트에 있는 음악 오름차순 내림차순
  setPlaylistMusicOrderDirection: (direction: OrderDirection) => void;
};

// 플레이어 컨텍스트 타입
type MusicPlayerContextValue = {
  /**
   * 음악 재생
   * @param musicId 음악 아이디
   */
  playMusic: (musicId: number) => void;

  /**
   * 현재 재생중인 음악
   * 재생 중이 아니면 null
   */
  currentMusic: MusicInPlaylist | null;

  /**
   * 이전 음악으로 이동
   */
  toPrevMusic: () => void;

  /**
   * 다음 음악으로 이동
   */
  toNextMusic: () => void;

  /**
   * 셔플 기능 on/off 여부
   */
  shuffleEnabled: boolean;

  /**
   * 셔플 기능을 켜고 끈다
   */
  toggleShuffle: () => void;
};

type SubLinkProps = {
  key: string;
  title: string;
  url?: string;
  isActive?: boolean;
};
