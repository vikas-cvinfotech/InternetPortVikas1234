'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function FaqSection({ title, faqs, image }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] lg::pr-0 xl:pr-0 xxl:pr-0 py-24">
      <div className="mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* LEFT FAQ */}
        <div className="py-6 xl:col-span-5 lg:p-6 ">
          {/* Dynamic Title */}
          {title && <h2 className="text-3xl font-bold text-secondary mb-16">{title}</h2>}

          <div className="bg-mediumlightgray">
            {faqs?.map((faq, i) => (
              <div key={i} className="py-4 px-6">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex justify-between items-center text-left text-[22px] font-bold"
                >
                  {faq.question}
                  <span className="text-2xl">
                    {openIndex === i ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#1D1D1D"
                        className="size-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#4F4F4F"
                        className="size-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </span>
                </button>
                {openIndex === i && <p className="mt-2 text-lightergray text-base">{faq.answer}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT IMAGE SECTION */}
        <div className="xl:col-span-7 text-center">
          <div className="ps-10 relative">
            <Image
              src={image}
              alt="FAQ Image"
              width={680}
              height={380}
              className="w-full object-cover mb-4"
            />
            <div className="absolute w-[20px] md:w-[20px] h-[50%] bg-accent top-0 left-0"></div>
          </div>
          <button className="bg-accent text-white px-4 py-4 rounded-md text-base font-semibold hover:bg-hoveraccent">
            View All FAQs
          </button>
        </div>
      </div>
    </div>
  );
}
