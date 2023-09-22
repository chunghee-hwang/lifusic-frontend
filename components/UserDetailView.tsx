import Pages from '@/constants/pages';
import { useAuth } from '@/contexts/AuthContext';
import ColorUtils from '@/utils/color';
import { Avatar, Button } from '@mui/material';
import { useMemo } from 'react';
import { styled } from 'styled-components';

const Container = styled.div`
  width: 10rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 1.8rem;
  right: -4rem;
  background-color: #00000081;
  border-radius: 0.5rem;
`;

const Space = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  & + & {
    margin-top: 0.5rem;
  }
`;

const UserName = styled.span`
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
`;

const Text = styled.span`
  color: white;
  font-size: 1rem;
`;

const AvatarComponent = styled(Avatar)`
  height: 2rem;
  width: 2rem;
  margin-right: 0.5rem;
`;

const LogoutButton = styled(Button)`
  margin-top: 0.5rem !important;
`;

const UserDetailView: React.FC = () => {
  const { isLogin, userData } = useAuth();

  const avatarBackgroundColor = useMemo(
    () => ColorUtils.stringToHslColor(userData?.email || '', 30, 80),
    [userData?.email]
  );
  if (!isLogin || !userData) {
    return <></>;
  }

  return (
    <Container>
      <Space>
        <AvatarComponent
          variant="circular"
          style={{ backgroundColor: avatarBackgroundColor }}
        />
        <UserName>{userData.name} 님</UserName>
      </Space>
      <Space>
        <Text>{userData.role == 'admin' ? '아티스트' : '고객'}</Text>
      </Space>
      <Space>
        <Text>{userData.email}</Text>
      </Space>
      <LogoutButton
        variant="contained"
        size="small"
        href={Pages.LOGOUT_PAGE.URL}
        color="warning"
      >
        로그아웃
      </LogoutButton>
    </Container>
  );
};

export default UserDetailView;
