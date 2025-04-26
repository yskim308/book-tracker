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
    <div>
      <button onClick={() => logoutOnClick()}>logout</button>
    </div>
  );
}
