export const renderDesc = (content, noPadding = false) => {
  if (!content) return null;

  const hasHTML = /<\/?[a-z][\s\S]*>/i.test(content);

  const baseClass = `text-base ${noPadding ? 'lg:pr-0' : 'lg:pr-[30px]'}`;

  if (hasHTML) {
    return <div className={baseClass} dangerouslySetInnerHTML={{ __html: content }} />;
  }

  return <div className={baseClass}>{content}</div>;
};
