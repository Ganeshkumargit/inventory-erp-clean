function DataTable({ columns, data, renderActions, emptyMessage = "No records found" }) {
  return (
    <div className="card shadow">
      <div className="card-body">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>

              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}

              {renderActions && <th width="180">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr key={row.id || row.category_id || row.product_id || index}>
                <td>{index + 1}</td>

                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}

                {renderActions && <td>{renderActions(row)}</td>}
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (renderActions ? 2 : 1)}
                  className="text-center"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;