"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

interface BookshelfCardProps {
  name: string;
  count: number;
}

export function BookshelfCard({ name, count }: BookshelfCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/bookshelves/${encodeURIComponent(name)}`);
  };

  return (
    <Card
      className="cursor-pointer transition-all duration-100 hover:bg-accent/50 border-border/50 my-1 py-1 rounded-lg"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="p-2 rounded-lg bg-inherit">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{name}</h3>
            </div>
          </div>
          <Badge
            variant="default"
            className="ml-2 text-xs bg-inherit text-slate-900"
          >
            {count}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
