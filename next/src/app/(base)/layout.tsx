import BookSearchbar from "@/components/searchbar/BookSearchbar";
import Profile from "@/components/profile/Profile";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <div className="flex justify-center relative my-5">
        <BookSearchbar />
        <div className="absolute right-0 mx-2 md:mx-5 my-1 md:my-0 flex flex-col justify-center">
          <Profile />
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
