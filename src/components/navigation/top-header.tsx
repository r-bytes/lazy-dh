const TopHeader = ({ text }: { text: string }) => {
  return <div className="flex h-12 items-center justify-center bg-yellow-400 text-center text-xs font-semibold text-black sm:text-sm">{text}</div>;
};

export default TopHeader;
