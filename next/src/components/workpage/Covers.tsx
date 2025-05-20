import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface CoversProps {
  keys: number[];
}

export default function Covers({ keys }: CoversProps) {
  const [images, setImages] = useState<string[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const coverBase = process.env.NEXT_PUBLIC_BOOK_COVER_BASE;

  if (!coverBase) {
    throw new Error("book cover base env variable not found");
  }

  useEffect(() => {
    const getCovers = async () => {
      try {
        setLoading(true);
        const keysToFetch = keys.slice(0, 10);
        const promises = keysToFetch.map(async (key) => {
          const response = await fetch(`${coverBase}/b/id/${key}-L.jpg`);
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        });
        const fetchedData: string[] = await Promise.all(promises);
        setImages(fetchedData);
      } catch (e) {
        console.error("Error fetching book covers:", e);
      } finally {
        setLoading(false);
      }
    };

    getCovers();
  }, [keys, coverBase]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin mb-4"></div>
        <p className="text-gray-600">Loading book covers...</p>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return <div className="text-center p-4">No book covers available</div>;
  }

  return (
    <Carousel className="w-full max-w-lg mx-auto">
      <CarouselContent className="flex-justify-center">
        {images.map((imageUrl, index) => (
          <CarouselItem key={`cover-${keys[index]}`} className="basis-1/3">
            <div className="p-1">
              <div className="flex aspect-9/16 items-center justify-center p-2 relative rounded-md overflow-hidden border border-gray-200">
                <Image
                  src={imageUrl}
                  alt={`Book cover ${keys[index]}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-blue-50" />
      <CarouselNext className="bg-blue-50" />
    </Carousel>
  );
}
