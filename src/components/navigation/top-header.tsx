import React from "react";

const TopHeader = ({text}: {text: string}) => {
  return <div className="text-xs sm:text-sm text-center flex justify-center items-center h-16 sm:h-10 bg-primary text-muted-foreground dark:text-secondary font-semibold">{text}</div>;
};

export default TopHeader;
