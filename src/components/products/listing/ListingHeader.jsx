'use client';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useTranslations } from 'next-intl';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CategoryHeader({
  title,
  subtitle,
  sortOptions,
  currentSort,
  onSortChange,
}) {
  const t = useTranslations('listing');
  return (
    <>
      <div className="flex items-baseline justify-between border-b border-divider pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-secondary">{title}</h1>
          <p className="mt-4 text-base text-secondary/70">{subtitle}</p>
        </div>

        <div className="flex items-center">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <MenuButton className="group inline-flex justify-center text-sm font-medium text-secondary hover:text-accent" aria-label={`Sort products, currently: ${currentSort || t('sort.label')}`}>
                {t('sort.label')}{currentSort && `: ${currentSort}`}
                <ChevronDownIcon
                  aria-hidden="true"
                  className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-secondary/50 group-hover:text-accent"
                />
              </MenuButton>
            </div>

            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-primary shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="py-1">
                {sortOptions.map((option) => (
                  <MenuItem key={option.name}>
                    <button
                      onClick={() => onSortChange(option.value ?? option.name)}
                      className={classNames(
                        currentSort === (option.value ?? option.name)
                          ? 'font-medium text-accent'
                          : 'text-secondary',
                        'block w-full px-4 py-2 text-left text-sm data-[focus]:bg-secondary/5 data-[focus]:text-accent'
                      )}
                    >
                      {option.name}
                    </button>
                  </MenuItem>
                ))}
              </div>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </>
  );
}
