'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const renderDesc = (content) => {
  if (!content) return null;

  const hasHTML = /<\/?[a-z][\s\S]*>/i.test(content); // detect HTML tags

  if (hasHTML) {
    return (
      <div
        className="text-base text-lightergray lg:pr-[30px] mb-4"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return <p className="text-base text-lightergray lg:pr-[30px] mb-4">{content}</p>;
};

export default function FaqSection({ title, faqs, image, link, linkLabel, alt = 'FAQ image' }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] lg::pr-0 xl:pr-0 xxl:pr-0 py-24">
      <div className="mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* LEFT FAQ */}
        <div className="py-6 xl:col-span-6 lg:pr-6 pt-0">
          {/* Dynamic Title */}
          {title && <h2 className="text-3xl font-bold text-secondary mb-16 capitalize">{title}</h2>}

          <div className="bg-mediumlightgray rounded-lg">
            {faqs?.map((faq, i) => (
              <div key={i} className={`py-4 px-6 ${i !== faqs.length - 1 ? 'border-b-2' : ''} `}>
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex justify-between items-start text-left text-[22px] font-bold gap-8 font-sans"
                >
                  {faq.question}
                  <span className="text-2xl">
                    {openIndex === i ? (
                      <svg
                        width="34"
                        height="34"
                        viewBox="0 0 34 34"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-[-5px]"
                      >
                        <g clipPath="url(#clip0_5417_2677)">
                          <path
                            d="M8.48528 8.4853C13.1654 3.80514 20.7757 3.80514 25.4558 8.4853C30.136 13.1655 30.136 20.7757 25.4558 25.4559C20.7757 30.136 13.1654 30.136 8.48528 25.4559C3.80512 20.7757 3.80512 13.1655 8.48528 8.4853ZM11.5478 13.1057C11.3854 13.2681 11.3894 13.5301 11.5485 13.6892L14.823 16.9637L11.5443 20.2423C11.3823 20.4047 11.3856 20.6661 11.5443 20.8251L13.1125 22.3933C13.2716 22.5522 13.5328 22.5553 13.6919 22.3899L16.9671 19.1147L20.2458 22.3933C20.4082 22.5554 20.6696 22.5522 20.8286 22.3933L22.3968 20.8251C22.5555 20.6661 22.5521 20.4048 22.3933 20.2458L19.1181 16.9706L22.3961 13.6926C22.5584 13.5303 22.5591 13.2717 22.4002 13.1126L20.832 11.5444C20.6696 11.3821 20.4076 11.386 20.2485 11.5451L16.974 14.8196L13.6961 11.5416C13.5336 11.3792 13.2744 11.3791 13.1153 11.5382L11.5478 13.1057Z"
                            fill="#1D1D1D"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_5417_2677">
                            <rect
                              width="24"
                              height="24"
                              fill="white"
                              transform="translate(0 16.9706) rotate(-45)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    ) : (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mt-[5px]"
                      >
                        <g clipPath="url(#clip0_5417_99)">
                          <path
                            d="M12 0C18.6187 0 24 5.38125 24 12C24 18.6187 18.6187 24 12 24C5.38125 24 0 18.6187 0 12C0 5.38125 5.38125 0 12 0ZM10.8984 5.43262C10.6687 5.43262 10.4863 5.6207 10.4863 5.8457V10.4766H5.84961C5.62024 10.4768 5.43771 10.664 5.4375 10.8887V13.1064C5.4376 13.3312 5.62017 13.5181 5.84961 13.5137H10.4814V18.1504C10.4817 18.3798 10.6688 18.5624 10.8936 18.5625H13.1113C13.336 18.5623 13.5183 18.3751 13.5186 18.1504V13.5186H18.1543C18.3839 13.5186 18.5672 13.3362 18.5674 13.1113V10.8936C18.5673 10.664 18.3792 10.4814 18.1543 10.4814H13.5234V5.8457C13.5234 5.61602 13.3402 5.43262 13.1152 5.43262H10.8984Z"
                            fill="#4F4F4F"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_5417_99">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    )}
                  </span>
                </button>
                {openIndex === i && (
                  <div className="mt-2 text-lightergray text-base">{renderDesc(faq.answer)}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT IMAGE SECTION */}
        <div className="xl:col-span-6 text-center">
          <div className="ps-10 relative">
            <Image
              src={image}
              alt={alt}
              width={680}
              height={380}
              className="w-full h-full object-cover mb-4"
            />
            <div className="absolute w-[15px] md:w-[20px] h-[50%] lg:h-[200px] bg-accent top-0 left-0"></div>
          </div>
          {link && linkLabel ? (
            <Link
              href={link}
              className="inline-block bg-accent text-white px-4 py-4 rounded-md text-base font-semibold hover:bg-hoveraccent"
            >
              {linkLabel}
            </Link>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
}
