import { useRouter } from 'next/navigation';
import PageUrls from '@/constants/page-urls';
import useLoginMutation from '@/hooks/login-mutation';
import { Alert, TextField as TF } from '@mui/material';
import { LoadingButton as LBtn } from '@mui/lab';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { styled } from 'styled-components';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 70%;
  font-size: 1rem;
  width: 100%;
`;

const H1 = styled.h1`
  font-size: 5rem;
`;

const TextField = styled(TF)`
  width: 20rem;
  & + & {
    margin-top: 2rem;
  }
`;

const LoadingButton = styled(LBtn)`
  width: 20rem;
  margin-top: 2rem !important;
`;

const SignUpLink = styled(Link)`
  margin-top: 1rem;
  width: 20rem;
  text-decoration: none;
  color: darkcyan;
`;

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginRequest>();
  const { isLogin } = useAuth();

  const {
    mutate: loginMutate,
    isLoading: isLoginLoading,
    isError: isLoginError,
  } = useLoginMutation();

  const onSubmit: SubmitHandler<LoginRequest> = (data) => {
    loginMutate(data);
  };

  useEffect(() => {
    if (isLogin) {
      router.replace(PageUrls.CHECK_USER_DATA_PAGE);
    }
  }, [isLogin]);

  return (
    <Container>
      <H1>Lifusic</H1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register('email')}
          label="이메일"
          type="email"
          variant="standard"
          required
        />
        <TextField
          {...register('password')}
          label="비밀번호"
          type="password"
          variant="standard"
          required
        />
        <LoadingButton
          type="submit"
          variant="contained"
          color="success"
          size="large"
          loading={isLoginLoading}
        >
          로그인
        </LoadingButton>
      </Form>
      <SignUpLink href={PageUrls.SIGNUP_PAGE}>회원 가입</SignUpLink>

      {!isLoginLoading && isLoginError && (
        <Alert severity="error">
          로그인 실패. 이메일 또는 비밀번호가 일치하지 않습니다.
        </Alert>
      )}
    </Container>
  );
}
