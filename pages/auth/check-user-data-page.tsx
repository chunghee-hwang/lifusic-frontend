import { UserRole } from '@/constants/constants';
import Pages from '@/constants/pages';
import { useAuth } from '@/contexts/AuthContext';
import { Container } from '@/styles/global-style';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function CheckUserDataPage() {
  const { isLogin, userData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLogin) {
      router.replace(Pages.LOGIN_PAGE.URL);
    }
  }, [isLogin]);

  useEffect(() => {
    if (userData) {
      switch (userData.role) {
        case UserRole.ADMIN:
          router.replace(Pages.MUSIC_ADMIN_CONSOLE_PAGE.URL);
          break;
        case UserRole.CUSTOMER:
          router.replace(Pages.MUSIC_SEARCH_PAGE.URL);
          break;
        default:
      }
    }
  }, [userData]);

  return <Container>{<>유저 데이터를 확인중입니다...</>}</Container>;
}
