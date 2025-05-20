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
        const promises = keys.map(async (key) => {
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
      <div className="flex justify-center items-center h-64">
        Loading covers...
      </div>
    );
  }

  if (!images || images.length === 0) {
    return <div className="text-center p-4">No book covers available</div>;
  }

  return (
    <Carousel className="w-full max-w-lg mx-auto">
      <CarouselContent>
        {images.map((imageUrl, index) => (
          <CarouselItem
            key={`cover-${keys[index]}`}
            className="md:basis-1/2 lg:basis-1/3"
          >
            <div className="p-1">
              <div className="flex aspect-square items-center justify-center p-2 relative rounded-md overflow-hidden border border-gray-200">
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
      <CarouselPrevious className="left-0" />
      <CarouselNext className="right-0" />
    </Carousel>
  );
}
