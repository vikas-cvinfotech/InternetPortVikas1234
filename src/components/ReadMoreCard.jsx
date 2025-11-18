'use client';
import Link from 'next/link';

const ReadMoreCard = ({ title, link, icon }) => {
  return (
    <div className="p-8 rounded-lg border flex items-center gap-4 shadow-darkShadow border-secondaryBg bg-primary">
      {/* ICON */}
      <div
        className="text-3xl bg-mediumlightgray p-4 rounded-full transition-all duration-300 ease-in-out
          group-hover:bg-accent group-hover:text-white"
      >
        {icon}
      </div>

      {/* TEXT + LINK */}
      <div>
        <h2 className="text-lg font-semibold mb-1">{title}</h2>

        <Link href={link} className="text-paraSecondary text-sm">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default ReadMoreCard;
