import { useScrollProgress } from '../hooks/useScrollProgress';

export default function ScrollProgress() {
  const progress = useScrollProgress();
  const percentage = Math.min(Math.max(progress, 0), 1) * 100;

  return (
    <div
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percentage)}
      className="fixed top-0 left-0 z-50 h-[2px] bg-brand-red pointer-events-none transition-[width] duration-75 ease-out"
      style={{ width: `${percentage}%` }}
    />
  );
}
