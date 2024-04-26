import { FaSearch } from "react-icons/fa";

function NoSearchResult() {
  return (
    <div className="m-3 mx-auto flex size-48 flex-col items-center justify-center gap-3 rounded-full border-white bg-gray-100 bg-opacity-25 p-5 text-center text-lg text-gray-600">
      <FaSearch size={60} className="p-3" />
      <span>Search didn't find anything.</span>
    </div>
  );
}

export default NoSearchResult;
