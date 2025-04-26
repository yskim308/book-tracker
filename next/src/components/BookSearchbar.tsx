import { useState } from "react";

export default function BookSearchbar() {
  const [value, setValue] = useState<string>("");
  return (
    <div>
      <input
        type="text"
        placeholder="search for books"
        value={value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setValue(event.target.value)
        }
      />
    </div>
  );
}
