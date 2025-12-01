import Link from 'next/link';

export default function StorageCard({
  title,
  link,
  linkLabel,
  configData,
  price,
  buylink,
  buyLabel,
  isPopular,
}) {
  return (
    <div className="borderbottomeffect h-max">
      <div className="border rounded-lg shadow-sm bg-primary py-8 px-4">
        <div
          className={`flex ${!isPopular ? 'justify-center' : 'justify-between'} items-center mb-16`}
        >
          <h2 className="text-2xl font-bold text-paraSecondary">{title}</h2>
          {link && linkLabel ? (
            <Link
              href={link}
              className="text-base font-normal bg-lightgreen rounded-lg px-3 py-1 leading-[24px] text-primary uppercase inline-block"
            >
              {linkLabel}
            </Link>
          ) : (
            ''
          )}
        </div>
        <div className="flex flex-col gap-4">
          {configData.map((config, idx) => (
            <div key={idx} className="flex text-accent justify-between items-center gap-2">
              <div className="flex items-start gap-2 max-w-xs">
                <div>{config.icon}</div>
                <span className="text-paraSecondary text-base font-normal">{config.label}</span>
              </div>
              <div className="text-accent font-bold text-base">{config.value}</div>
            </div>
          ))}
        </div>
        <hr className="mt-6 mb-8" />
        <div className="flex justify-between">
          <div className="text-accent font-bold text-base">{price}</div>
          <div>
            <Link
              href={buylink}
              className="rounded-md w-auto bg-accent hover:bg-hoveraccent px-3 py-2 mt-0 text-sm font-semibold text-primary shadow-xs inline-flex items-center gap-2 capitalize"
            >
              {buyLabel}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
