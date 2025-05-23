"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import type { Edition } from "@/types";
import { useState } from "react";

interface EditionCardProps {
  edition: Edition;
  isLoading?: boolean;
}

export function EditionCard({ edition, isLoading = false }: EditionCardProps) {
  const [imageLoading, setImageLoading] = useState(true);

  // Function to get cover image URL
  const getCoverImageUrl = (coverId: number) => {
    return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
  };

  if (isLoading) {
    return (
      <Card className="mb-4 overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cover image skeleton */}
            <div className="flex items-center justify-center p-4 bg-muted">
              <div className="relative w-[150px] h-[225px] bg-secondary rounded-md shadow-md flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            </div>

            {/* Edition details skeleton */}
            <div className="col-span-2 p-4">
              <Skeleton className="h-8 w-3/4 mb-6" />
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-40" />
                </div>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-48" />
                </div>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Cover image */}
          <div className="flex items-center justify-center p-4 bg-muted">
            {edition.covers && edition.covers.length > 0 ? (
              <div className="relative w-[150px] h-[225px]">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-secondary rounded-md">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                )}
                <Image
                  src={
                    getCoverImageUrl(edition.covers[0]) || "/placeholder.svg"
                  }
                  alt={edition.title}
                  width={150}
                  height={225}
                  className={`object-contain max-h-[225px] rounded-md shadow-md ${imageLoading ? "opacity-0" : "opacity-100"}`}
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
              </div>
            ) : (
              <div className="w-[150px] h-[225px] bg-secondary flex items-center justify-center rounded-md shadow-md">
                <span className="text-secondary-foreground text-sm">
                  No cover available
                </span>
              </div>
            )}
          </div>

          {/* Edition details */}
          <div className="col-span-2 p-4">
            <h3 className="text-xl font-bold mb-3">{edition.title}</h3>
            <Table>
              <TableBody>
                {edition.isbn_13 && (
                  <TableRow>
                    <TableCell className="font-medium">ISBN-13</TableCell>
                    <TableCell>{edition.isbn_13}</TableCell>
                  </TableRow>
                )}
                {edition.publish_date && (
                  <TableRow>
                    <TableCell className="font-medium">Publish Date</TableCell>
                    <TableCell>{edition.publish_date}</TableCell>
                  </TableRow>
                )}
                {edition.publishers && edition.publishers.length > 0 && (
                  <TableRow>
                    <TableCell className="font-medium">Publisher(s)</TableCell>
                    <TableCell>{edition.publishers.join(", ")}</TableCell>
                  </TableRow>
                )}
                {edition.number_of_pages && (
                  <TableRow>
                    <TableCell className="font-medium">Pages</TableCell>
                    <TableCell>{edition.number_of_pages}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
