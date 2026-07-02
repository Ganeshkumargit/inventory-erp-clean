function SearchBox({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="mb-3">
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBox;