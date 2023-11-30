interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | null;
  fullPage?: boolean;
}

const Loader = ({ size = 'md', fullPage = true }: LoaderProps) => {
  let loaderSize = '';
  switch (size) {
    case 'sm':
      loaderSize = 'h-3 w-3';
      break;
    case 'lg':
      loaderSize = 'h-24 w-24';
      break;
    case 'xl':
      loaderSize = 'h-32 w-32';
      break;
    case 'md':
    default:
      loaderSize = 'h-10 w-10';
  }
  return (
    <div className={`flex justify-center items-center ${!!fullPage && 'min-h-screen'}`}>
      <div
        className={`animate-spin rounded-full ${loaderSize} border-t-2 border-b-2 border-secondary`}
      ></div>
    </div>
  );
};

export default Loader;
