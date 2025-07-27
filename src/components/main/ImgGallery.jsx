import { useEffect, useState } from "react";
import url from "../../url";

const ImgGallery = ({ src }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (src.length === 0) return; // Prevent interval if no images

    const lastIndex = src.length - 1;
    const nextImage = () => {
      setIndex((prevIndex) => (prevIndex === lastIndex ? 0 : prevIndex + 1));
    };

    const id = setInterval(nextImage, 6000); // Change image every 6 seconds
    return () => clearInterval(id); // Clean up on unmount
  }, [src]); // Correct dependency to `src` array

  if (src.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">No images available.</p>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      {/* Image Container */}
      <div className="w-full aspect-video">
        <img
          className="w-full h-full object-cover transition-opacity duration-500 rounded-xl"
          key={src[index]}
          src={
            src[index].startsWith("http") ? src[index] : `${url}${src[index]}`
          }
          alt={`findhome ${index + 1}`}
        />
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {src.map((_, idx) => (
          <span
            key={idx}
            onClick={() => setIndex(idx)}
            className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${
              idx === index ? "bg-white w-6" : "bg-white/50 hover:bg-white/70"
            }`}></span>
        ))}
      </div>

      {/* Navigation Arrows (added enhancement) */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 focus:outline-none"
        onClick={() =>
          setIndex((prevIndex) =>
            prevIndex === 0 ? src.length - 1 : prevIndex - 1
          )
        }>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor">
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 focus:outline-none"
        onClick={() =>
          setIndex((prevIndex) =>
            prevIndex === src.length - 1 ? 0 : prevIndex + 1
          )
        }>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor">
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default ImgGallery;
