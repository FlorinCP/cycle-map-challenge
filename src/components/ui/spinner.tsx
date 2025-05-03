export const Spinner = ({ className = "" }) => (
  <div className={`animate-spin h-8 w-8 border-4 border-zinc-200 border-t-primary rounded-full ${className}`} />
);

export const LoadingScreen = () => {
  return <div className={"w-screen h-screen flex justify-center items-center"}>
    <Spinner className={"w-6 h-6"} />
  </div>
}