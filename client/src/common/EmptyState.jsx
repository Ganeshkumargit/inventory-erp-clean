function EmptyState({ message = "No records found" }) {
  return (
    <div className="text-center py-4 text-muted">
      <div style={{ fontSize: "42px" }}>📭</div>
      <h6 className="mt-2">{message}</h6>
      <p className="mb-0">Once data is added, it will appear here.</p>
    </div>
  );
}

export default EmptyState;