import BookSearchbar from "@/components/searchbar/BookSearchbar";
import Profile from "@/components/profile/Profile";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <div className="flex justify-center relative my-3">
        <BookSearchbar />
        <div className="absolute top-0 right-0 mx-2">
          <Profile />
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
