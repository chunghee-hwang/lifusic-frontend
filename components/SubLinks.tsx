import { useRouter } from 'next/router';
import PageUrls from '@/constants/page-urls';
import Link from 'next/link';
import { styled } from 'styled-components';

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
    case PageUrls.LOGIN_PAGE:
      subLinks.push({
        key: 'login',
        title: '로그인',
      });
      break;
    case PageUrls.SIGNUP_PAGE:
      subLinks.push({
        key: 'signup',
        title: '회원 가입',
      });
      break;
    case PageUrls.MUSIC_ADMIN_CONSOLE_PAGE:
    case PageUrls.MUSIC_ADD_PAGE:
      subLinks.push(
        {
          key: 'musicConsole',
          title: '음악 관리',
          url: PageUrls.MUSIC_ADMIN_CONSOLE_PAGE,
          isActive: pathname === PageUrls.MUSIC_ADMIN_CONSOLE_PAGE,
        },
        {
          key: 'addMusic',
          title: '음악 추가',
          url: PageUrls.MUSIC_ADD_PAGE,
          isActive: pathname === PageUrls.MUSIC_ADD_PAGE,
        }
      );
      break;
    case PageUrls.MUSIC_SEARCH_PAGE:
    case PageUrls.MUSIC_PLAYLIST_PAGE:
      subLinks.push(
        {
          key: 'searchMusic',
          title: '음악 찾기',
          url: PageUrls.MUSIC_SEARCH_PAGE,
          isActive: pathname === PageUrls.MUSIC_SEARCH_PAGE,
        },
        {
          key: 'playlist',
          title: '재생 목록',
          url: PageUrls.MUSIC_PLAYLIST_PAGE,
          isActive: pathname === PageUrls.MUSIC_PLAYLIST_PAGE,
        }
      );
      break;
    default:
  }
  return (
    <Ul>
      {subLinks.map((subLinkProps) => (
        <SubLink {...subLinkProps} />
      ))}
    </Ul>
  );
};

export default SubLinks;
