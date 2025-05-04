interface Props {
  children: React.ReactNode;
}

export const PageMapLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[50%_50%] lg:grid-cols-[40%_60%] xl:grid-cols-[35%_65%] 2xl:grid-cols-[25%_75%] min-h-screen max-h-screen w-full">
      {children}
    </div>
  );
};
