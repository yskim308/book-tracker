import Image from "next/image";

export default function LogoutButton() {
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
  if (!backendBase) {
    throw new Error("backend environment variable not found");
  }
  const logoutOnClick = async () => {
    try {
      await fetch(`${backendBase}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e: unknown) {
      console.log(e);
    } finally {
      window.location.reload();
    }
  };
  return (
    <div className="flex justify-center hover:bg-gray-300 rounded-3xl py-2">
      <Image src="/images/logout.svg" alt="" width={20} height={20} />
      <button onClick={() => logoutOnClick()} className="px-1">
        logout
      </button>
    </div>
  );
}
