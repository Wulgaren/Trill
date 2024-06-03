import { FaSearch } from "react-icons/fa";

function NoSearchResult() {
  return (
    <div className="m-3 mx-auto flex size-48 flex-col items-center justify-center gap-3 rounded-full border-white bg-gray-200 bg-opacity-25 p-5 text-center text-lg text-gray-600 dark:text-white">
      <FaSearch size={60} className="p-3" />
      <span>Nothing was found.</span>
    </div>
  );
}

export default NoSearchResult;
