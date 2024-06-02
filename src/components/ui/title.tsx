const Title = ({ name, cn }: { name: string, cn?: string }) => {
  return <div className={`${cn} text-4xl text-center mb-8 text-muted-foreground font-medium tracking-wide`}>{name}</div>;
};

export default Title;
