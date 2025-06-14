export interface User {
  id: number;
  googleId?: string;
  name?: string;
  email?: string;
  picture?: string;
  isLoading: boolean;
}

export interface UserBook {
  id: number;
  externalId: string;
  completionDate: string;
  author: string[];
  title: string;
  status: "READ" | "TO_READ" | "READING";
}

export interface SearchBook {
  author_name: string[];
  cover_edition_key: string;
  key: string;
  title: string;
  first_publish_year: number;
}

export interface Work {
  title: string;
  key: string;
  authors: {
    author: {
      key: string;
    };
  }[];
  description: string | { value: string } | undefined;
  covers: number[];
  subjects: string[];
}

export interface Edition {
  authors: {
    key: string;
  }[];
  isbn_13: string;
  publish_date: string;
  publishers: string[];
  title: string;
  works: {
    key: string;
  }[];
  covers: number[];
  number_of_pages: number;
}

export interface Author {
  personal_name: string;
  key: string;
  birth_date: string;
  name: string;
  bio: string;
}

export interface Bookshelf {
  name: string;
  count: number;
}
