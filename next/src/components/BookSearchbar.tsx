import { useState } from "react";

export default function BookSearchbar() {
  const [value, setValue] = useState<string>("");
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValue("");
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="search for books"
          value={value}
          onChange={handleChange}
        />
      </form>
    </div>
  );
}
