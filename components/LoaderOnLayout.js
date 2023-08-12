import Spinner from "components/SpinnerMui";

const LoaderOnLayout = () => {
  return (
    <div className="flex justify-center items-center flex--fill-height-with-header">
      <Spinner />
    </div>
  );
};

export default LoaderOnLayout;
