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

  return (
    <div>
      <h2>Parsed Chunks</h2>
      <ul>
        {parsedList.map((item, index) => (
          <>
            <li
              key={item.metadata?.title}
              className="pb-2 pt-4 grid gap-2 grid-cols-6"
            >
              <input
                value={item?.metadata?.title ?? ""}
                onChange={(e) => handleListChange(index, e.target.value)}
                className="text-black col-span-5"
              />
              <button onClick={() => handleRemoveItem(index)}>Remove</button>
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
          </>
        ))}
      </ul>
      <button onClick={handleAddItem}>Add Chunk</button>
    </div>
  );
}
