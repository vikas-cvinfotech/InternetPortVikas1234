import Link from 'next/link';
import React from 'react';

const AdvisorContactCard = ({ title, link, linkLabel }) => {
  return (
    <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] pb-24 my-1">
      <div className="relative z-[1]">
        <div className="borderbottomeffect advisorcontactcard">
          <div className="bg-secondary text-primary rounded-lg p-8 flex flex-col gap-30 justify-center items-center">
            <h2 className="text-2xl font-bold">{title}</h2>
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
