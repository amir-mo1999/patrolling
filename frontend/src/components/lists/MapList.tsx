import React from "react";

interface ListItem {
  id: number;
  imageUrl: string;
  text: string;
}

interface MapListProps {
  items: ListItem[];
}

const MapList: React.FC<MapListProps> = ({ items }) => {
  const handleItemClick = (itemId: number) => {
    // Placeholder click method
    console.log(`Item clicked with ID: ${itemId}`);
  };

  return (
    <div className="max-w-md mx-auto p-4 overflow-y-auto border rounded-md shadow-md">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center p-2 mb-2 transition duration-300 ease-in-out cursor-pointer hover:bg-gray-100"
          onClick={() => handleItemClick(item.id)}
        >
          <img
            src={item.imageUrl}
            alt={`Item ${item.id}`}
            className="w-10 h-10 object-cover rounded-full mr-4"
          />
          <div>
            <h3 className="text-lg font-semibold">{item.text}</h3>
            <p className="text-gray-500">Some additional text here...</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MapList;
