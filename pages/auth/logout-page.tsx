import pageUrls from '@/constants/page-urls';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { styled } from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 70%;
  font-size: 1rem;
  width: 100%;
`;

export default function LogoutPage() {
  const { isLogin, userData, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLogin) {
      router.replace(pageUrls.LOGIN_PAGE);
    }
  }, [isLogin, userData]);

  useEffect(() => {
    logout();
  }, []);

  return (
    <Container>
      <div>로그아웃 중...</div>
    </Container>
  );
}
