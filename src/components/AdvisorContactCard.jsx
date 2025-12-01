import Link from 'next/link';
import React from 'react';

const AdvisorContactCard = ({ title, desc, link, linkLabel, paddingBottom, gap }) => {
  return (
    <div
      className={`px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] ${
        paddingBottom ? paddingBottom : 'pb-24'
      } my-1 w-full`}
    >
      <div className="relative z-[1]">
        <div className="borderbottomeffect advisorcontactcard">
          <div
            className={`bg-secondary text-primary rounded-lg p-8 flex flex-col gap-30 justify-center items-center ${
              gap ? gap : ''
            }`}
          >
            <h2 className="text-2xl font-bold">{title}</h2>
            {desc && <p className="text-base text-center text-secondaryBg max-w-[85%]">{desc}</p>}
            <Link
              href={link}
              className="bg-accent text-primary text-base p-4 rounded-[4px] font-semibold hover:bg-hoveraccent shadow-secondaryShadow"
            >
              {linkLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorContactCard;
