
type Props = {
  path: string;
  width?: string;
  height?: string;
}
export const Logo = ({ path, width, height }: Props) => {
  return (
    <img
      src={path}
      alt={'Logo'}
      style={{ width: width ?? '50%', height: height ?? '50%', objectFit: 'contain' }}
    />
  );
};

