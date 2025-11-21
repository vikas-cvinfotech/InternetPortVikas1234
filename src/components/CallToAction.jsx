import Link from 'next/link';
import React from 'react';

export default function CallToAction({ title, desc, link, linkLabel }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <h2 className="font-bold text-[52px] text-darkGray ">{title}</h2>
      <p className="text-base text-paraSecondary leading-6 pt-1 pb-4">{desc}</p>
      <Link
        href={link}
        className="inline-block bg-accent text-primary text-base p-4 rounded-[4px] font-semibold hover:bg-hoveraccent shadow-secondaryShadow"
      >
        {' '}
        {linkLabel}
      </Link>
    </div>
  );
}
