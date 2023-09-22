import useCheckRole from '@/hooks/check-role';

export default function MusicManagement() {
  useCheckRole();
  return (
    <>
      <div>Hello World!</div>
    </>
  );
}
