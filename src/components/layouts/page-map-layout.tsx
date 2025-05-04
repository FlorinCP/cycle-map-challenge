interface Props {
  children: React.ReactNode;
}

export const PageMapLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[30%_70%] lg:grid-cols-[25%_75%] min-h-screen max-h-screen w-full">
      {children}
    </div>
  );
};
