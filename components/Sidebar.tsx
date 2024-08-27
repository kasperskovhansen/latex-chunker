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
    <div>
      <h2>Parsed Chunks</h2>
      <ul>
        {parsedList.map((item, index) => (
          <>
            <div className="flex">
              <div className="flex-grow">
                <li
                  key={item.metadata?.title}
                  className="pb-2 pt-4 grid gap-2 grid-cols-6"
                >
                  <button
                    className="border-2"
                    style={{
                      backgroundColor: item?.backgroundColor,
                      borderColor: item?.color,
                      color: item?.color,
                    }}
                    onClick={() => handleRemoveItem(index)}
                  >
                    Remove
                  </button>
                </li>
                {item?.metadata &&
                  Object.entries(item.metadata).map(([key, value], _) => (
                    <li key={key} className="pb-2 grid gap-2 grid-cols-6">
                      <span className="col-span-1">{key}</span>
                      <input
                        value={value ?? ""}
                        onChange={(e) =>
                          handleListChange(index, key, e.target.value)
                        }
                        className="text-black col-span-4"
                      />
                    </li>
                  ))}
              </div>
              <div className="flex flex-col justify-center items-center">
                <button
                  onClick={() => handleScrollToChunk(index)}
                  className="w-4 h-full border-2"
                  style={{
                    backgroundColor: item?.backgroundColor,
                    borderColor: item?.color,
                  }}
                ></button>
              </div>
            </div>
          </>
        ))}
      </ul>
      <button onClick={handleAddItem}>Add Chunk</button>
    </div>
  );
}
