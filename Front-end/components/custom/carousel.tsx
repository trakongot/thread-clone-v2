"use client";
import { useState } from "react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { DialogContent } from "./dialog";
import axios from "axios";
import Image from "next/image";
import { useQuery } from "react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [zoomedResource, setZoomedResource] = useState<string | null>(null);

  const currentResource = images[activeIndex];

  const { data: isVideoFile, isLoading } = useQuery(
    ["checkVideo", currentResource],
    () => checkIfVideo(currentResource),
    {
      staleTime: 60 * 1000, // Cache time to prevent frequent requests
    }
  );

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleZoom = (resource: string) => {
    setZoomedResource(resource);
  };

  return (
    <div className="relative w-full">
      <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <div
                className="cursor-pointer"
                onClick={() => handleZoom(currentResource)}
              >
                {isVideoFile ? (
                  <video
                    controls
                    autoPlay
                    muted
                    className="absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2 object-cover"
                  >
                    <source src={currentResource} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <Image
                    src={currentResource}
                    alt="Slide"
                    width={500}
                    height={500}
                    className="absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2 object-cover"
                  />
                )}
              </div>
            </DialogTrigger>
            <DialogContent>
              {zoomedResource &&
                (isVideoFile ? (
                  <video
                    controls
                    autoPlay
                    loop
                    className="max-h-full max-w-full object-contain"
                  >
                    <source src={zoomedResource} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src={zoomedResource}
                    alt="Zoomed"
                    width={1000}
                    height={1000}
                    className="max-h-full max-w-full object-contain"
                  />
                ))}
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Navigation Buttons */}
      <button
        className="ease-[cubic-bezier(0.25,0.1,0.25,1.0)] absolute inset-y-0 left-0 z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center text-white opacity-50 transition-opacity duration-150 hover:text-white hover:no-underline hover:opacity-90 hover:outline-none focus:text-white focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none"
        onClick={prevSlide}
      >
        <ChevronLeft />
      </button>
      <button
        className="ease-[cubic-bezier(0.25,0.1,0.25,1.0)] absolute inset-y-0 right-0 z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center text-white opacity-50 transition-opacity duration-150 hover:text-white hover:no-underline hover:opacity-90 hover:outline-none focus:text-white focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none"
        onClick={nextSlide}
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default Carousel;
