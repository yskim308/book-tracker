import BookSearchbar from "@/components/searchbar/BookSearchbar";
import Profile from "@/components/profile/Profile";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <div className="flex p-3">
        <BookSearchbar />
        <Profile />
      </div>
      <div>{children}</div>
    </div>
  );
}
