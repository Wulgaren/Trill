import { useState } from "react";

const CollapsibleText = ({
  text,
  maxLength = 100,
}: {
  text: string;
  maxLength: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleText = () => {
    setIsExpanded((prev) => !prev);
  };

  const displayedText = isExpanded ? text : text.slice(0, maxLength);

  return (
    <div
      className="relative cursor-pointer pb-1 text-sm text-black after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 after:ease-in-out after:content-[''] hover:after:left-0 hover:after:w-full dark:text-white dark:after:bg-white"
      onClick={toggleText}
    >
      <p
        className="inline whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: displayedText }}
      ></p>
      <p className="inline">{!isExpanded && "..."}</p>
    </div>
  );
};

export default CollapsibleText;
