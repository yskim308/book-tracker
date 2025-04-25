export interface User {
  id: number;
  googleId?: string;
  name?: string;
  email?: string;
  picture?: string;
  books: Book[];
}

export interface Book {
  title: string;
  link: string;
  completionDate: string;
  status: "READ" | "READING" | "TO_READ";
}
