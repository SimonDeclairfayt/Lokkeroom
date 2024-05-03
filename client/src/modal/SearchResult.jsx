import { Result } from "postcss";

export default function SearchResult({ result, setInput, setResult }) {
  const handleClick = (value) => {
    setInput(value);
    setResult([]);
  };
  return (
    <ul className="result-list">
      {result.map((res) => {
        return (
          <li key={res.users_id} onClick={() => handleClick(res.username)}>
            {res.username}
          </li>
        );
      })}
    </ul>
  );
}
