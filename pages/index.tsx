import Pages from '@/constants/pages';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();
  useEffect(() => {
    router.replace(Pages.CHECK_USER_DATA_PAGE.URL);
  }, []);

  return <></>;
}
