const TopHeader = ({ text }: { text: string }) => {
  return <div className="flex h-12 items-center justify-center bg-accent-yellow dark:text-black text-center text-xs font-semibold text-text-primary sm:text-sm">{text}</div>;
};

export default TopHeader;
