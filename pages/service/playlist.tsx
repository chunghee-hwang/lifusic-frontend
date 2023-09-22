import useCheckRole from '@/hooks/check-role';

export default function Playlist() {
  useCheckRole();
  return (
    <>
      <div>Hello World!</div>
    </>
  );
}
