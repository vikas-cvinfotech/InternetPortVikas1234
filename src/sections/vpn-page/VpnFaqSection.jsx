'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function VpnFaqSection({
  title = 'FAQ Title',
  subtitle = 'FAQ Subtitle',
  faqs = [],
}) {
  return (
    <div className="bg-secondary/5 py-20">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-secondary/70 max-w-3xl mx-auto">{subtitle}</p>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-primary rounded-2xl p-8 shadow-sm">
            <dl className="space-y-4">
              {faqs.map((faq, index) => (
                <Disclosure
                  key={index}
                  as="div"
                  className="border-b border-divider last:border-b-0"
                >
                  <dt>
                    <DisclosureButton className="group flex w-full items-start justify-between py-6 text-left">
                      <span className="text-base font-semibold text-secondary group-data-open:text-accent">
                        {faq.question}
                      </span>
                      <span className="ml-6 flex h-7 items-center">
                        <ChevronDownIcon
                          className="h-6 w-6 text-secondary/50 group-hover:text-secondary transition-all duration-200 group-data-open:rotate-180 group-data-open:text-accent"
                          aria-hidden="true"
                        />
                      </span>
                    </DisclosureButton>
                  </dt>
                  <DisclosurePanel className="pb-6">
                    <dd className="text-base text-secondary/70 leading-7">{faq.answer}</dd>
                  </DisclosurePanel>
                </Disclosure>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
