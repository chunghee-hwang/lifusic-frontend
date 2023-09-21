import PageUrls from '@/constants/page-urls';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { styled } from 'styled-components';
import { Avatar } from '@mui/material';
import { useMemo, useState } from 'react';
import ColorUtils from '@/utils/color';
import UserDetailView from './UserDetailView';

const Text = styled.div`
  font-weight: 700;
  font-size: 1rem;
  color: black;
`;

const LinkComponent = styled(Link)`
  text-decoration: none;
`;

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
`;

const AvatarComponent = styled(Avatar)`
  height: 1.8rem;
  width: 1.8rem;
  margin-right: 0.5rem;
`;

const UserProfile: React.FC = () => {
  const { isLogin, userData } = useAuth();
  const router = useRouter();
  const pathname = router.pathname;
  const [showUserTooltip, setShowUserTooltip] = useState(false);
  const avatarBackgroundColor = useMemo(
    () => ColorUtils.stringToHslColor(userData?.email || '', 30, 80),
    [userData?.email]
  );

  if (pathname == PageUrls.LOGIN_PAGE) {
    return (
      <LinkComponent href={PageUrls.SIGNUP_PAGE}>
        <Text>회원 가입</Text>
      </LinkComponent>
    );
  }
  if (pathname == PageUrls.SIGNUP_PAGE || !isLogin || !userData) {
    return (
      <LinkComponent href={PageUrls.LOGIN_PAGE}>
        <Text>로그인</Text>
      </LinkComponent>
    );
  }

  return (
    <Container
      onClick={() => {
        setShowUserTooltip(!showUserTooltip);
      }}
    >
      <AvatarComponent
        variant="circular"
        style={{ backgroundColor: avatarBackgroundColor }}
      />
      <div>{userData.name} 님</div>
      {isLogin && userData && showUserTooltip && <UserDetailView />}
    </Container>
  );
};

export default UserProfile;
