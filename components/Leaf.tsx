const Leaf = ({ attributes, children, leaf }) => {
  return (
    <div
      id={`chunk-${leaf.chunk?.id}`}
      {...attributes}
      style={{
        background: leaf?.chunk?.backgroundColor
          ? leaf.chunk.backgroundColor
          : "inherit",
      }}
      className="px-2"
    >
      <span
        style={{
          color: leaf?.chunk?.color ? leaf.chunk.color : "inherit",
          counterIncrement: "line",
        }}
      >
        {children}
      </span>
    </div>
  );
};

export default Leaf;
