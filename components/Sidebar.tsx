import {
  addChunk,
  removeChunk,
  selectParsedList,
  updateChunk,
} from "../app/store/editorSlice";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch } from "../app/store";

export default function Sidebar() {
  const parsedList = useSelector(selectParsedList);
  const dispatch = useDispatch<AppDispatch>();

  // Handle list item changes
  const handleListChange = (
    chunkIndex: number,
    metadataKey: string,
    newValue: string
  ) => {
    dispatch(updateChunk({ chunkIndex, metadataKey, newValue }));
  };

  // Add a new item to the list
  const handleAddItem = () => {
    dispatch(addChunk("New Chunk"));
    setTimeout(() => {
      requestAnimationFrame(() => {
        handleScrollToChunk(parsedList.length - 1);
      });
    });
  };

  // Remove an item from the list
  const handleRemoveItem = (index: number) => {
    dispatch(removeChunk(index));
  };

  // Scroll to a specific chunk
  const handleScrollToChunk = (index: number) => {
    const chunkId = parsedList[index]?.id;
    const chunkElement = document.getElementById(`chunk-${chunkId}`);
    if (chunkElement) {
      chunkElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col items-start justify-between h-full">
      <div className="bg-gray-100 h-full w-full p-4 shadow-lg overflow-y-scroll">
        <ul className="space-y-6 ">
          {parsedList.map((item, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-grow space-y-3">
                {/* Loop through metadata */}
                {item?.metadata &&
                  Object.entries(item.metadata).map(([key, value]) => (
                    <li
                      key={key}
                      className="grid grid-cols-6 items-center gap-4"
                    >
                      <span className="text-gray-600 col-span-2">{key}</span>
                      <input
                        value={value ?? ""}
                        onChange={(e) =>
                          handleListChange(index, key, e.target.value)
                        }
                        className="col-span-4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-800"
                      />
                    </li>
                  ))}
                <div className="flex justify-start gap-2">
                  <button
                    className="col-span-1 bg-red-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-red-600 transition"
                    onClick={() => handleRemoveItem(index)}
                  >
                    Remove chunk
                  </button>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center">
                <button
                  onClick={() => handleScrollToChunk(index)}
                  className="w-8 rounded-md transition border-2 hover:bg-indigo-500 hover:border-indigo-500 hover:shadow-lg h-full"
                  style={{
                    backgroundColor: item?.backgroundColor,
                  }}
                ></button>
              </div>
            </div>
          ))}
        </ul>
      </div>
      <button
        onClick={handleAddItem}
        className="w-full bg-green-500 text-white font-semibold px-4 py-2 hover:bg-green-600 transition"
      >
        Add Chunk
      </button>
    </div>
  );
}
