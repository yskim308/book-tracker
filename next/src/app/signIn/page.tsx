"use client";
export default function SignInPage() {
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;

  if (!backendBase) {
    throw new Error("backend base environment variable not found");
  }

  const goToAuth = (authProvider: string) => {
    window.location.href = `${backendBase}/auth/${authProvider}`;
  };

  return (
    <div>
      <h1>hello from the sign in page</h1>
      <button onClick={() => goToAuth("google")}>sign in with gogle</button>
    </div>
  );
}
