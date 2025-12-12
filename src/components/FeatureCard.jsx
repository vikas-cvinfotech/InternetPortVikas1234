'use client';

export default function FeatureCard({ title, icon, paddX }) {
  return (
    <div className="relative z-[0]">
      <div className="borderbottomeffect h-full">
        <div
          className={`
            group block flex items-center gap-4 border shadow-darkShadow rounded-lg
            ${paddX ? `p-${paddX}` : 'p-6'}
            bg-primary border-borderGray h-full transition-all duration-300
          `}
        >
          <dt className="font-semibold text-secondary">
            <div
              className="
                rounded-full inline-flex items-center p-4
                bg-surfaceSecondary text-accent
                transition-all duration-300
                group-hover:bg-hoveraccent group-hover:text-primary
              "
            >
              {icon}
            </div>
          </dt>

          <dd className="flex flex-auto items-center justify-between text-base/7 text-secondary">
            <div className="flex flex-col gap-4">
              <div className="text-lg font-semibold text-secondary">{title}</div>
            </div>
          </dd>
        </div>
      </div>
    </div>
  );
}
