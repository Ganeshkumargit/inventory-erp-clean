function FormCard({ title, children }) {
  return (
    <div className="card shadow mb-4">
      <div className="card-header bg-white">
        <h5 className="mb-0">{title}</h5>
      </div>

      <div className="card-body">{children}</div>
    </div>
  );
}

export default FormCard;