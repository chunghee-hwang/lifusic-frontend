import { UserRole } from '@/constants/constants';
import pageUrls from '@/constants/page-urls';
import { useAuth } from '@/contexts/AuthContext';
import { Container } from '@/styles/global-style';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function CheckUserDataPage() {
  const { isLogin, userData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLogin) {
      router.replace(pageUrls.LOGIN_PAGE);
    }
  }, [isLogin]);

  useEffect(() => {
    if (userData) {
      switch (userData.role) {
        case UserRole.ADMIN:
          router.replace(pageUrls.MUSIC_ADMIN_CONSOLE_PAGE);
          break;
        case UserRole.CUSTOMER:
          router.replace(pageUrls.MUSIC_SEARCH_PAGE);
          break;
        default:
      }
    }
  }, [userData]);

  return <Container>{<>유저 데이터를 확인중입니다...</>}</Container>;
}
