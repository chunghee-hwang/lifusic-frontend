import useLoginMutation from '@/hooks/login-mutation';
import useUserDataQuery from '@/hooks/user-data-query';
import { useEffect } from 'react';

export default function Index() {
  const { mutate: loginMutate } = useLoginMutation();
  const { data: userData } = useUserDataQuery();
  useEffect(() => {
    loginMutate({
      email: '?',
      password: '?',
    });
  });

  return (
    <div>
      <p>User status: {userData ? 'Login' : 'Logout'} </p>
      <>
        <p>user name: {userData?.name}</p>
        <p>user email: {userData?.email}</p>
        <p>user id: {userData?.id}</p>
      </>
    </div>
  );
}
