'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function ContentBlock({
  title,
  desc,
  desc1,
  desc2,
  desc3,
  link,
  linkLabel,
  imageUrl,
  alt,
  padd,
  mainTitle,
  mainDesc,
  directionReverse,
  layoutSecond,
}) {
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

  return (
    <div
      className={`px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] ${padd ? padd : 'py-24'} ${
        directionReverse ? 'sm:ps-0 xl:ps-0 xxl:ps-0' : 'sm:pr-0 xl:pr-0 xxl:pr-0'
      }`}
    >
      {(mainTitle || mainDesc) && (
        <div className={`text-center ${mainDesc ? 'mb-[80px]' : 'mb-[60px]'} `}>
          <h1 className="text-[32px] text-secondary mb-4 font-bold">{mainTitle}</h1>
          <p className="text-base text-paraSecondary font-bold">{mainDesc}</p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-2">
        {layoutSecond ? (
          <div className="flex flex-col gap-30">
            <div className="flex rounded-lg bg-primary gap-4">
              <dt className="text-2xl/7 font-semibold text-secondary">
                <div className="rounded-md inline-flex items-center bg-surfaceSecondary p-5">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M36.4844 11.7969H3.51562C1.57703 11.7969 0 13.3739 0 15.3125V24.6875C0 26.6261 1.57703 28.2031 3.51562 28.2031H36.4844C38.423 28.2031 40 26.6261 40 24.6875V15.3125C40 13.3739 38.423 11.7969 36.4844 11.7969ZM37.5327 18.1804L35.1889 22.8679C34.757 23.7292 33.5242 23.7292 33.0923 22.8679L31.7969 20.2769L30.5014 22.8679C30.0601 23.7481 28.4116 23.6985 28.2233 22.5048L26.1595 18.3761C26.0244 18.2103 25.9474 18.002 25.9224 17.7797C25.908 17.9151 25.8784 18.0513 25.8138 18.1804L23.4701 22.8679C23.0382 23.7292 21.8054 23.7292 21.3735 22.8679L20.0781 20.2769L18.6264 22.8679C18.2281 23.6621 16.9281 23.6621 16.5298 22.8679C16.3502 22.5087 14.1249 18.1566 14.0816 17.7948C14.0522 18.0473 13.9569 18.2775 13.8027 18.4527C13.5984 18.8611 11.6912 22.8159 11.3716 23.1122C10.713 23.8161 9.82563 23.5202 9.49852 22.8679L8.20312 20.2769L6.90766 22.8679C6.47578 23.7292 5.24297 23.7292 4.81109 22.8679L2.46734 18.1804C1.77484 16.7955 3.86922 15.7483 4.56391 17.1321L5.85938 19.723L7.15484 17.1321C7.57711 16.2876 8.83031 16.2957 9.25141 17.1321L10.5469 19.723L11.8423 17.1321C12.3634 16.0901 14.0257 16.3804 14.0788 17.6202C14.1208 16.3769 15.7479 16.0668 16.2827 17.1321L17.5781 19.723L18.8736 17.1321C19.2719 16.3379 20.7281 16.3379 21.1264 17.1321L22.4219 19.723L23.7173 17.1321C24.2499 16.0711 25.8669 16.3716 25.9198 17.6094C25.9698 16.3163 27.642 16.1007 28.1577 17.1321L29.4531 19.723L30.7486 17.1321C31.1469 16.3379 32.4469 16.3379 32.8452 17.1321L34.1406 19.723L35.4361 17.1321C36.1308 15.7483 38.2252 16.7955 37.5327 18.1804ZM14.0689 9.45312H18.75V4.93398C16.9746 5.43124 15.3296 7.05531 14.0689 9.45312ZM21.25 2.49257V2.55866C24.2052 3.08351 26.8024 5.57843 28.5277 9.45312H34.064C31.0184 5.4232 26.3446 2.84343 21.25 2.49257ZM5.93602 9.45312H11.4723C13.1976 5.57843 15.7948 3.08351 18.75 2.55859V2.49249C13.6554 2.84343 8.98164 5.4232 5.93602 9.45312ZM21.25 4.93398V9.45312H25.9311C24.6704 7.05531 23.0254 5.43124 21.25 4.93398ZM14.0689 30.5469C15.3296 32.9447 16.9746 34.5687 18.75 35.066V30.5469H14.0689ZM21.25 30.5469V35.066C23.0254 34.5687 24.6704 32.9447 25.9311 30.5469H21.25ZM28.5277 30.5469C26.8024 34.4216 24.2052 36.9165 21.25 37.4414V37.5075C26.3446 37.1566 31.0184 34.5768 34.064 30.5469H28.5277ZM11.4723 30.5469H5.93602C8.98156 34.5768 13.6553 37.1566 18.75 37.5074V37.4413C15.7948 36.9165 13.1976 34.4216 11.4723 30.5469Z"
                      fill="#BE1823"
                    />
                  </svg>
                </div>
              </dt>
              <dd className="flex flex-auto flex-col gap-4">
                <div className="text-2xl font-bold text-darkGray">Domain registration</div>
                <p className="text-base text-paraSecondary">
                  Choose from our wide array of top-level domains.
                </p>
              </dd>
            </div>
            <div className="flex rounded-lg bg-primary gap-4">
              <dt className="text-2xl/7 font-semibold text-secondary">
                <div className="rounded-md inline-flex items-center bg-surfaceSecondary p-5">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 11.3892V28.6113C0 29.1192 0.429609 29.5485 0.938516 29.5485H39.0645C39.57 29.5485 39.9997 29.1192 39.9997 28.6113V11.3892C39.9997 10.8808 39.57 10.4516 39.0645 10.4516H0.938516C0.429609 10.4516 0 10.8808 0 11.3892ZM7.76711 23.8669H5.17773V16.1335H7.76703C9.19375 16.1335 10.3555 17.2944 10.3555 18.722V21.2785C10.3555 22.7056 9.19383 23.8669 7.76711 23.8669ZM14.0624 39.0868C12.8686 37.3631 11.8484 35.0771 11.0759 32.4056H4.31633C6.82938 35.5674 10.2481 37.8906 14.0624 39.0868ZM20.0001 40.0001C17.8 40.0001 15.5494 37.0755 14.0607 32.4057H25.9402C24.4516 37.0755 22.2009 40.0001 20.0001 40.0001ZM35.685 32.4056H28.9251C28.1526 35.0771 27.1323 37.3631 25.9385 39.0868C29.7528 37.8906 33.1716 35.5674 35.685 32.4056ZM25.9386 0.913142C27.1323 2.63681 28.1526 4.92283 28.9252 7.59431H35.6851C33.1716 4.43259 29.7528 2.10947 25.9386 0.913142ZM20.0001 -6.10352e-05C22.201 -6.10352e-05 24.4516 2.92494 25.9403 7.59431H14.0607C15.5493 2.92494 17.8 -6.10352e-05 20.0001 -6.10352e-05ZM4.31633 7.59431H11.0759C11.8484 4.92283 12.8686 2.63681 14.0624 0.913142C10.2481 2.10947 6.82938 4.43259 4.31633 7.59431ZM3.74937 13.2763H7.76711C10.7696 13.2763 13.2128 15.7191 13.2128 18.722V21.2785C13.2128 24.281 10.7697 26.7241 7.76711 26.7241H3.74937C2.96086 26.7241 2.32055 26.0842 2.32055 25.2952V14.7047C2.32055 13.9157 2.96086 13.2763 3.74937 13.2763ZM14.5544 25.2952V14.7047C14.5545 14.4055 14.6485 14.1139 14.8232 13.8711C14.9978 13.6282 15.2443 13.4462 15.5279 13.3509C15.8115 13.2553 16.1179 13.2513 16.4039 13.3393C16.6899 13.4274 16.9411 13.6031 17.1218 13.8416L22.5894 21.0484V14.7046C22.5894 13.9156 23.2288 13.2763 24.0178 13.2763C24.8063 13.2763 25.4466 13.9156 25.4466 14.7046V25.2952C25.4466 25.5943 25.3526 25.8858 25.178 26.1287C25.0035 26.3716 24.7571 26.5536 24.4736 26.649C24.19 26.7447 23.8836 26.7489 23.5975 26.6609C23.3115 26.5729 23.0604 26.3972 22.8796 26.1587L17.4116 18.9514V25.2952C17.4116 26.0842 16.7727 26.724 15.9832 26.724C15.1946 26.7241 14.5544 26.0842 14.5544 25.2952ZM33.6037 23.8669C34.276 23.8669 34.8232 23.3197 34.8232 22.6474C34.8232 21.9756 34.276 21.4284 33.6037 21.4284H30.8653C28.6172 21.4284 26.7887 19.6003 26.7887 17.3525C26.7887 15.1048 28.6173 13.2763 30.8653 13.2763H33.6037C35.1244 13.2763 36.5081 14.1162 37.2154 15.4684C37.5819 16.1672 37.3123 17.0307 36.6143 17.3968C35.9155 17.7628 35.0519 17.4932 34.6859 16.7945C34.4723 16.3867 34.0574 16.1335 33.6037 16.1335H30.8653C30.193 16.1335 29.6459 16.6803 29.6459 17.3526C29.6459 18.0245 30.193 18.5712 30.8653 18.5712H33.6037C35.8519 18.5712 37.6787 20.3998 37.6787 22.6474C37.6787 24.8952 35.8519 26.7241 33.6037 26.7241H30.8653C29.5423 26.7241 28.2958 26.0749 27.5305 24.9878C27.0759 24.3424 27.2314 23.4515 27.8759 22.997C28.5216 22.5429 29.4125 22.6979 29.867 23.3428C30.0974 23.671 30.4706 23.8668 30.8653 23.8668L33.6037 23.8669Z"
                      fill="#BE1823"
                    />
                  </svg>
                </div>
              </dt>
              <dd className="flex flex-auto flex-col gap-4">
                <div className="text-2xl font-bold text-darkGray">DNS Console</div>
                <p className="text-base text-paraSecondary">
                  Internetport DNS Console is an DNS management platform. Simply enter your zone
                  names to import DNS entries. You don't even need to copy-and-paste them. Use our
                  DNS Console and API to view your DNS entries, add to them, edit them, or delete
                  them. All completely free of cost.
                </p>
                {/* {feature.href && (
                <p className="mt-6">
                  <Link
                    href={feature.href}
                    className="text-base font-semibold text-accent hover:text-hoveraccent uppercase"
                  >
                    {feature.linkLabel} <span aria-hidden="true">→</span>
                  </Link>
                </p>
              )} */}
              </dd>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4 mt-8">
              <Link
                href="https://portal.internetport.com/checkdomain/domains/"
                className="inline-block text-base font-semibold text-primary bg-accent hover:bg-hoveraccent capitalize p-4 rounded-[4px]"
              >
                Register Domain
              </Link>
              <Link
                href="https://portal.internetport.com/cart/anycastdns"
                className="inline-block text-base font-semibold text-primary bg-secondary hover:opacity-90 transition-opacity capitalize p-4 rounded-[4px]"
              >
                Create a Free DNS Account
              </Link>
            </div>
          </div>
        ) : (
          <div className={directionReverse ? 'order-2 px-0 md:px-8 lg:px-0' : 'pr-8 lg:pr-0'}>
            {title && (
              <h2 className="text-2xl lg:text-[32px] font-bold tracking-tight text-darkGray mb-[20px] lg:mb-[30px]">
                {title}
              </h2>
            )}
            {desc && renderDesc(desc)}
            {desc1 && renderDesc(desc1)}
            {desc2 && renderDesc(desc2)}
            {desc3 && renderDesc(desc3)}
            {link && linkLabel ? (
              <Link
                href={link}
                className="inline-block bg-accent text-white px-4 py-4 rounded-md text-base font-semibold hover:bg-hoveraccent mt-4"
              >
                {linkLabel}
              </Link>
            ) : (
              ''
            )}
          </div>
        )}

        <div className={`relative ${directionReverse ? 'order-1 pr-10' : 'ps-10'}`}>
          <Image
            alt={alt}
            src={imageUrl}
            width={1360}
            height={760}
            quality={100}
            className="w-full bg-primary/10 object-cover "
          />
          <div
            className={`absolute w-[20px] md:w-[20px] h-[50%] bg-accent top-0 ${
              directionReverse ? 'right-0' : 'left-0'
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
}
