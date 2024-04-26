import { FaExclamationTriangle } from "react-icons/fa";

function ErrorResult() {
  return (
    <div className="m-3 mx-auto flex size-48 flex-col items-center justify-center gap-3 rounded-full border-white bg-red-500 bg-opacity-50 p-5 text-center text-lg text-white">
      <FaExclamationTriangle size={60} className="p-3" />
      <span>Error fetching data.</span>
    </div>
  );
}

export default ErrorResult;
