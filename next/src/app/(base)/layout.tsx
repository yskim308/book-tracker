import BookSearchbar from "@/components/searchbar/BookSearchbar";
import Profile from "@/components/profile/Profile";
import { UserProvider } from "@/context/UserContext";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <UserProvider>
        <div className="flex justify-center relative my-5">
          <BookSearchbar />
          <div className="absolute right-0 mx-2 md:mx-5 flex justify-center">
            <Profile />
          </div>
        </div>
        <div>{children}</div>
      </UserProvider>
    </div>
  );
}
