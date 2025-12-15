export const renderTitle = (title) => {
  if (!title) return null;

  const hasHTML = /<\/?[a-z][\s\S]*>/i.test(title); // detect HTML tags

  if (hasHTML) {
    return (
      <h2
        className="text-2xl leading-[1.5] lg:text-[32px] font-bold tracking-tight text-darkGray mb-[20px] lg:mb-[30px]"
        dangerouslySetInnerHTML={{ __html: title }}
      />
    );
  }

  return (
    <h2 className="text-2xl leading-[1.5] lg:text-[32px] font-bold tracking-tight text-darkGray mb-[20px] lg:mb-[30px]">
      {title}
    </h2>
  );
};
