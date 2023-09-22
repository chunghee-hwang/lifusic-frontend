import { Container } from '@/styles/global-style';
import { Alert } from '@mui/material';
import Link from 'next/link';

export default function CustomerMusics() {
  return (
    <Container>
      <div>
        <Alert severity="error">페이지에 접근할 수 있는 권한이 없습니다.</Alert>
        <br />
        <Link href="/">메인 페이지로 이동</Link>
      </div>
    </Container>
  );
}
