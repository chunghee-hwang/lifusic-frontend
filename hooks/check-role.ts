// 유저의 role과 페이지를 비교하여, 권한이 없으면 403 페이지로 이동

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import Pages from '@/constants/pages';
import { useEffect, useState } from 'react';

function useCheckRole() {
  const router = useRouter();

  const { isLogin, userData } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    const matchedPage = Object.values(Pages).find(
      (page) => page.URL === router.pathname
    );
    if (!matchedPage) {
      setIsAuthorized(false);
    } else {
      if (matchedPage.ROLE === 'ALL') {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(isLogin && matchedPage.ROLE === userData?.role);
      }
    }
  }, [isLogin, userData, router]);

  useEffect(() => {
    if (!isAuthorized) {
      router.replace(Pages.UNAUTHORIZED_PAGE.URL);
    }
  }, [isAuthorized]);

  return {
    isAuthorized,
  };
}

export default useCheckRole;
