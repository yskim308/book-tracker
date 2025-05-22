import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface ProfileContextProps {
  name: string;
  picture: string;
}

export default function ProfileContext({ name, picture }: ProfileContextProps) {
  return (
    <div className="flex flex-col items-center pt-2 px-2 bg-card">
      <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-primary/10 mb-3">
        <Image
          src={picture || "/placeholder.svg"}
          alt={`${name}'s profile picture`}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <h3 className="font-medium text-lg">{name}</h3>
        <Badge variant="secondary" className="text-xs font-normal">
          Logged In
        </Badge>
      </div>

      <Separator className="mt-3" />
    </div>
  );
}
