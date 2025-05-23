import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { Edition } from "@/types";

interface EditionCardProps {
  edition: Edition;
}

export function EditionCard({ edition }: EditionCardProps) {
  // Function to get cover image URL
  const getCoverImageUrl = (coverId: number) => {
    return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
  };

  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Cover image */}
          <div className="flex items-center justify-center p-4 bg-muted">
            {edition.covers && edition.covers.length > 0 ? (
              <Image
                src={getCoverImageUrl(edition.covers[0]) || "/placeholder.svg"}
                alt={edition.title}
                width={150}
                height={225}
                className="object-contain max-h-[225px] rounded-md shadow-md"
              />
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
                {edition.authors && edition.authors.length > 0 && (
                  <TableRow>
                    <TableCell className="font-medium w-1/3">
                      Author(s)
                    </TableCell>
                    <TableCell>
                      {edition.authors.map((author, index) => (
                        <span key={author.key}>
                          {author.key.replace("/authors/", "")}
                          {index < edition.authors.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </TableCell>
                  </TableRow>
                )}
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
