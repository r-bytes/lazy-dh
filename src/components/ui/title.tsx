const Title = ({ name, cn }: { name: string, cn?: string }) => {
  return <div className={`${cn} md:text-5xl text-3xl mb-8 text-center font-bold text-muted-foreground`}>{name}</div>;
};

export default Title;
