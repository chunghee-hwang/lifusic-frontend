import Pages from '@/constants/pages';
import { useRouter } from 'next/router';

export default function Index() {
  const router = useRouter();
  router.replace(Pages.CHECK_USER_DATA_PAGE.URL);
  return <></>;
}
