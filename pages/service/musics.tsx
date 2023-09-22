import useCheckRole from '@/hooks/check-role';

export default function CustomerMusics() {
  useCheckRole();
  return (
    <>
      <div>Hello World!</div>
    </>
  );
}
