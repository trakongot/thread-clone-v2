"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { useQuery } from "react-query";
import axios from "axios";

const checkIfVideo = async (url: string): Promise<boolean> => {
  try {
    const response = await axios.head(url);
    const contentType = response.headers["content-type"];
    return contentType?.startsWith("video/") || false;
  } catch (error) {
    console.error("Error checking video:", error);
    return false;
  }
};

interface CarouselProps {
  images: string[];
}

const MediaItem: React.FC<{
  resource: string;
  index: number;
  isActive: boolean;
  onClick: (index: number) => void;
  onError: (index: number) => void;
  refCallback: (el: HTMLVideoElement | HTMLImageElement | null) => void;
}> = ({ resource, index, isActive, onClick, onError, refCallback }) => {
  const { data: isVideoFile, isLoading } = useQuery(
    ["checkVideo", resource],
    () => checkIfVideo(resource),
    { staleTime: 60 * 1000 }
  );

  const commonClassNames = `relative cursor-pointer h-auto max-h-[400px] rounded-lg transition-transform duration-300 ease-in-out ${
    isActive ? "scale-110 shadow-lg" : "scale-100"
  }`;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isVideoFile ? (
    <video
      className={commonClassNames}
      controls
      autoPlay
      muted
      width={300}
      height={200}
      src={resource}
      onError={() => onError(index)}
      onClick={() => onClick(index)}
      ref={refCallback}
    />
  ) : (
    <Image
      width={300}
      height={200}
      className={commonClassNames}
      src={resource}
      alt={`carousel image ${index + 1}`}
      onError={() => onError(index)}
      onClick={() => onClick(index)}
      ref={refCallback}
    />
  );
};

const Carousel2: React.FC<CarouselProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [validImages, setValidImages] = useState<string[]>(images);
  const imgRefs = useRef<(HTMLVideoElement | HTMLImageElement | null)[]>([]);

  const handleItemClick = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
    imgRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  const handleImageError = (index: number) => {
    const updatedImages = [...validImages];
    updatedImages.splice(index, 1);
    setValidImages(updatedImages);
  };

  return (
    <section className="relative w-full overflow-x-auto overflow-y-hidden py-6">
      <div className="flex snap-x snap-mandatory space-x-6  px-4 pb-3">
        {validImages.map((resource, index) => (
          <div key={index} className="shrink-0 snap-center">
            <MediaItem
              resource={resource}
              index={index}
              isActive={activeIndex === index}
              onClick={handleItemClick}
              onError={handleImageError}
              refCallback={(el) => (imgRefs.current[index] = el)}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Carousel2;
