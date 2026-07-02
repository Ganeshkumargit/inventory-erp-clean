function StatCard({ title, value }) {
  return (
    <div className="card shadow text-center">
      <div className="card-body">
        <h6 className="text-muted">{title}</h6>
        <h2>{value}</h2>
      </div>
    </div>
  );
}

export default StatCard;