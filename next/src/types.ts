export interface User {
  id: number;
  googleId?: string;
  name?: string;
  email?: string;
  picture?: string;
  books: UserBook[];
}

export interface UserBook {
  title: string;
  link: string;
  completionDate: string;
  status: "READ" | "READING" | "TO_READ";
}

export interface SearchBook {
  id: string;
  volumeInfo: {
    title: string;
    publisher: string;
    publishedDate: string;
    authors: string[];
    description: string;
    imageLinks: {
      smallThumbnail: string;
      thumbnail: string;
    };
    pageCount: number;
    language: string;
  };
}
