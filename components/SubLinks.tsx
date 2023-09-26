import { useRouter } from 'next/router';
import Pages from '@/constants/pages';
import Link from 'next/link';
import { styled } from 'styled-components';
import { SubLinkProps } from '@/constants/types/types';

const LinkComponent = styled(Link)`
  text-decoration: none;
  & + & {
    margin-left: 0.5rem;
  }
`;

const SubText = styled.span<{ $isActive?: boolean }>`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${(props) => (props.$isActive ? '#27c7fc' : 'black')};
`;

const Ul = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SubLink: React.FC<SubLinkProps> = ({ title, url, isActive }) => {
  if (!url) {
    return <SubText>{title}</SubText>;
  }
  return (
    <LinkComponent href={url}>
      <SubText $isActive={isActive}>{title}</SubText>
    </LinkComponent>
  );
};

const SubLinks: React.FC = () => {
  const router = useRouter();
  const pathname = router.pathname;
  const subLinks: Array<SubLinkProps> = [];
  switch (pathname) {
    case Pages.LOGIN_PAGE.URL:
      subLinks.push({
        key: 'login',
        title: '로그인',
      });
      break;
    case Pages.SIGNUP_PAGE.URL:
      subLinks.push({
        key: 'signup',
        title: '회원 가입',
      });
      break;
    case Pages.MUSIC_ADMIN_CONSOLE_PAGE.URL:
    case Pages.MUSIC_ADD_PAGE.URL:
      subLinks.push(
        {
          key: 'musicConsole',
          title: '음악 관리',
          url: Pages.MUSIC_ADMIN_CONSOLE_PAGE.URL,
          isActive: pathname === Pages.MUSIC_ADMIN_CONSOLE_PAGE.URL,
        },
        {
          key: 'addMusic',
          title: '음악 추가',
          url: Pages.MUSIC_ADD_PAGE.URL,
          isActive: pathname === Pages.MUSIC_ADD_PAGE.URL,
        }
      );
      break;
    case Pages.MUSIC_SEARCH_PAGE.URL:
    case Pages.MUSIC_PLAYLIST_PAGE.URL:
      subLinks.push(
        {
          key: 'searchMusic',
          title: '음악 찾기',
          url: Pages.MUSIC_SEARCH_PAGE.URL,
          isActive: pathname === Pages.MUSIC_SEARCH_PAGE.URL,
        },
        {
          key: 'playlist',
          title: '재생 목록',
          url: Pages.MUSIC_PLAYLIST_PAGE.URL,
          isActive: pathname === Pages.MUSIC_PLAYLIST_PAGE.URL,
        }
      );
      break;
    default:
  }
  return (
    <Ul>
      {subLinks.map(({ key, title, url, isActive }) => (
        <SubLink key={key} title={title} url={url} isActive={isActive} />
      ))}
    </Ul>
  );
};

export default SubLinks;
