interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  message?: string;
}

export const Loading = ({ size = 'md', fullScreen = false, message }: LoadingProps) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const spinner = (
    <div className={`${sizeMap[size]} animate-spin`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="w-full h-full"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75 text-primary-600"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="flex flex-col items-center gap-lg bg-white p-2xl rounded-xl">
          {spinner}
          {message && <p className="text-dark-900 font-medium">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-md py-2xl">
      {spinner}
      {message && <p className="text-dark-600 text-sm">{message}</p>}
    </div>
  );
};

Loading.displayName = 'Loading';
