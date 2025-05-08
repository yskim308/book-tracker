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
  author_name: string[];
  cover_edition_key: string;
  key: string;
  title: string;
  first_publish_year: number;
}
