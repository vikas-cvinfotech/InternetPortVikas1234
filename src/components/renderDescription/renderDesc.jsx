export const renderDesc = (content) => {
  if (!content) return null;

  const hasHTML = /<\/?[a-z][\s\S]*>/i.test(content); // detect HTML tags

  if (hasHTML) {
    return <div className="text-base lg:pr-[30px]" dangerouslySetInnerHTML={{ __html: content }} />;
  }

  return <div className="text-base lg:pr-[30px]">{content}</div>;
};
