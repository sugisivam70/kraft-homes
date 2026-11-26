import { company } from '../data/company';

export default function BrandDivider({ theme = 'light', label }) {
  const isDark = theme === 'dark';

  return (
    <div
      className={`w-full py-6 ${
        isDark ? 'bg-carbon text-pure-white' : 'bg-ivory text-carbon'
      }`}
      aria-hidden="true"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center gap-5">
        <div
          className={`h-px flex-1 ${
            isDark
              ? 'bg-gradient-to-r from-transparent via-pure-white/15 to-bronze/40'
              : 'bg-gradient-to-r from-transparent via-carbon/15 to-bronze/50'
          }`}
        />
        <div className="flex items-center gap-3 shrink-0">
          <img
            src={isDark ? company.logos.monogramLight : company.logos.monogramDark}
            alt=""
            className="h-6 w-auto opacity-70"
          />
          {label && (
            <span className="font-body text-[10px] uppercase tracking-[0.26em] text-bronze">
              {label}
            </span>
          )}
        </div>
        <div
          className={`h-px flex-1 ${
            isDark
              ? 'bg-gradient-to-l from-transparent via-pure-white/15 to-bronze/40'
              : 'bg-gradient-to-l from-transparent via-carbon/15 to-bronze/50'
          }`}
        />
      </div>
    </div>
  );
}
