'use client';

export default function BrfFinalCtaSection({ ctaData }) {
  const title = ctaData?.title || 'Kontakta Oss';
  const subtitle = ctaData?.subtitle || 'Vi är redo att hjälpa dig.';

  const contactMethodsToDisplay = ctaData?.contactMethods || [];

  return (
    <div className="bg-primary py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">{title}</h2>
        <p className="mt-4 text-lg leading-8 text-secondary/80 max-w-2xl mx-auto">{subtitle}</p>

        <div className="mt-16 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
          {contactMethodsToDisplay.map((method) => (
            <a
              href={method.href}
              key={method.name}
              className="group flex flex-col items-center p-6 border border-divider rounded-lg shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              {method.icon && (
                <div className="flex size-12 items-center justify-center rounded-full bg-accent text-primary mb-4">
                  <method.icon className="size-6" aria-hidden="true" />
                </div>
              )}
              <h3 className="text-lg font-semibold leading-6 text-secondary group-hover:text-accent transition-colors">
                {method.name}
              </h3>
              <p className="mt-2 text-base leading-7 text-secondary/90 group-hover:text-accent/90 transition-colors">
                {method.value}
              </p>
              <p className="mt-1 text-sm leading-6 text-secondary/70">{method.description}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
