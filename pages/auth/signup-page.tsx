import { UserRole } from '@/constants/constants';
import Pages from '@/constants/pages';
import useSignUpMutation from '@/hooks/sign-up-mutation';
import { Container } from '@/styles/global-style';
import { LoadingButton as LBtn } from '@mui/lab';
import {
  Alert,
  FormControl as FControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField as TF,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { styled } from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const TextField = styled(TF)`
  width: 20rem;
  & + & {
    margin-top: 1rem !important;
  }
`;

const FormControl = styled(FControl)`
  margin-top: 1rem !important;
`;

const LoadingButton = styled(LBtn)`
  width: 20rem;
  margin-top: 2rem !important;
`;

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpRequestForm>();
  const {
    mutate: signUpMutate,
    isLoading: isSignUpLoading,
    isSuccess: isSignUpSuccess,
    isError: isSignUpError,
  } = useSignUpMutation();

  const router = useRouter();

  // 회원가입 성공 시 5초 뒤 로그인 페이지로 이동
  useEffect(() => {
    if (isSignUpSuccess) {
      setTimeout(() => {
        router.replace(Pages.LOGIN_PAGE.URL);
      }, 5000);
    }
  }, [isSignUpSuccess]);

  const password = useRef({});
  password.current = watch('password', '');

  const onSubmit: SubmitHandler<SignUpRequest> = (data) => {
    const payload: SignUpRequest = {
      email: data.email,
      name: data.name,
      password: data.password,
      role: data.role,
    };
    signUpMutate(payload);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register('email', {
            pattern: /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
          })}
          label="이메일"
          variant="standard"
          required
          error={!!errors.email}
          helperText={errors.email && '이메일 형식에 맞게 입력해주세요.'}
        />
        <TextField
          {...register('name')}
          label="성명"
          type="text"
          variant="standard"
          required
        />
        <TextField
          {...register('password', {
            minLength: 4,
          })}
          label="비밀번호"
          type="password"
          variant="standard"
          required
          error={!!errors.password}
          helperText={
            errors.password && '비밀번호는 최소 4글자 이상이어야 합니다.'
          }
        />
        <TextField
          {...register('passwordConfirm', {
            validate: (value: string) => {
              return value === password.current;
            },
          })}
          label="비밀번호 확인"
          type="password"
          variant="standard"
          required
          error={!!errors.passwordConfirm}
          helperText={errors.passwordConfirm && '비밀번호가 일치하지 않습니다.'}
        />
        <FormControl>
          <FormLabel id="user-role">사용자 유형</FormLabel>
          <RadioGroup row aria-labelledby="sign-up-role" name="role-group">
            <FormControlLabel
              value={UserRole.ADMIN}
              control={<Radio {...register('role')} />}
              label="아티스트"
              required
            />
            <FormControlLabel
              value={UserRole.CUSTOMER}
              control={<Radio {...register('role')} />}
              label="일반 사용자"
              required
            />
          </RadioGroup>
        </FormControl>
        <LoadingButton
          type="submit"
          variant="contained"
          color="success"
          size="large"
          loading={isSignUpLoading}
          disabled={isSignUpSuccess}
        >
          회원 가입
        </LoadingButton>
      </Form>
      {isSignUpError && (
        <Alert severity="error">회원가입에 실패하였습니다.</Alert>
      )}
      {isSignUpSuccess && (
        <Alert>
          회원가입에 성공하였습니다. 잠시 후 로그인 페이지로 이동합니다.
        </Alert>
      )}
    </Container>
  );
}
