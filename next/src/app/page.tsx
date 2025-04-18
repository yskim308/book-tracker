"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const goToAuth = () => {
    router.push("/signIn");
  };

  return (
    <div>
      <h1>hello world from nextjs</h1>
      <button onClick={goToAuth}>click here to signin</button>
    </div>
  );
}
