import Image from "next/image";
import { Separator } from "radix-ui";

interface ProfileContextProps {
  name: string;
  picture: string;
}

export default function ProfileContext({ name, picture }: ProfileContextProps) {
  return (
    <div className="w-full flex flex-col items-center p-2">
      <Image
        src={picture}
        alt="/images/account-circle-outline"
        width={60}
        height={60}
        className="rounded-full"
      />
      <div>hi, {name}</div>
      <Separator.Separator className="h-px w-full bg-gray-400 mt-3" />
    </div>
  );
}
