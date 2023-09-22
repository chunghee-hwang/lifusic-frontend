import pageUrls from '@/constants/page-urls';
import { useRouter } from 'next/router';

export default function Index() {
  const router = useRouter();
  router.replace(pageUrls.CHECK_USER_DATA_PAGE);
  return <></>;
}
