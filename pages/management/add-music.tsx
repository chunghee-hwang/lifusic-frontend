import useCheckRole from '@/hooks/check-role';

export default function AddMusicPage() {
  useCheckRole();
  return (
    <>
      <div>Hello World!</div>
    </>
  );
}
