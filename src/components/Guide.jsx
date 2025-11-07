import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';

const Guide = ({ children, onBackClick }) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  return (
    <div className="w-full max-w-md p-6 sm:p-8 space-y-4 bg-primary rounded-lg shadow-md border border-divider relative">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 text-secondary hover:text-accent"
        aria-label="Gå tillbaka"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <div className="pt-8 flex flex-col items-center">{children}</div>
    </div>
  );
};

export default Guide;
