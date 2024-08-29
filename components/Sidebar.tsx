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
      <div className="w-full h-full p-4 overflow-y-scroll bg-gray-100 shadow-lg">
        <ul className="space-y-6 ">
          {parsedList.map((item, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-grow space-y-3">
                {/* Loop through metadata */}
                {item?.metadata &&
                  Object.entries(item.metadata).map(([key, value]) => (
                    <li
                      key={key}
                      className="grid items-center grid-cols-6 gap-4"
                    >
                      <span className="col-span-2 text-gray-600">{key}</span>
                      <input
                        value={value ?? ""}
                        onChange={(e) =>
                          handleListChange(index, key, e.target.value)
                        }
                        className="col-span-4 px-3 py-2 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </li>
                  ))}
                <div className="flex justify-start gap-2">
                  <button
                    className="col-span-1 px-4 py-2 font-semibold text-white transition bg-red-500 rounded-md hover:bg-red-600"
                    onClick={() => handleRemoveItem(index)}
                  >
                    Remove chunk
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <button
                  onClick={() => handleScrollToChunk(index)}
                  className="w-8 h-full transition border-2 rounded-md hover:bg-indigo-500 hover:border-indigo-500 hover:shadow-lg"
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
        className="w-full px-4 py-2 font-semibold text-white transition bg-green-500 hover:bg-green-600"
      >
        Add Chunk
      </button>
    </div>
  );
}
