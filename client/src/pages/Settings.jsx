import PageHeader from "../common/PageHeader";
import FormCard from "../common/FormCard";

function Settings() {
  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Application configuration and system information"
      />

      <div className="row">
        <div className="col-md-6">
          <FormCard title="Application Details">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Application Name</th>
                  <td>StockFlow ERP</td>
                </tr>

                <tr>
                  <th>Version</th>
                  <td>1.0.0</td>
                </tr>

                <tr>
                  <th>Environment</th>
                  <td>Production</td>
                </tr>

                <tr>
                  <th>Frontend</th>
                  <td>React + Bootstrap</td>
                </tr>

                <tr>
                  <th>Backend</th>
                  <td>Node.js + Express</td>
                </tr>

                <tr>
                  <th>Database</th>
                  <td>PostgreSQL</td>
                </tr>

                <tr>
                  <th>Storage</th>
                  <td>AWS S3</td>
                </tr>
              </tbody>
            </table>
          </FormCard>
        </div>

        <div className="col-md-6">
          <FormCard title="Deployment Details">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Domain</th>
                  <td>gkdevops.shop</td>
                </tr>

                <tr>
                  <th>Hosting</th>
                  <td>AWS EC2</td>
                </tr>

                <tr>
                  <th>Web Server</th>
                  <td>Nginx</td>
                </tr>

                <tr>
                  <th>Process Manager</th>
                  <td>PM2</td>
                </tr>

                <tr>
                  <th>SSL</th>
                  <td>Let's Encrypt HTTPS</td>
                </tr>

                <tr>
                  <th>DNS</th>
                  <td>AWS Route 53</td>
                </tr>
              </tbody>
            </table>
          </FormCard>
        </div>
      </div>

      <FormCard title="Completed Features">
        <div className="row">
          <div className="col-md-4">
            <ul>
              <li>JWT Authentication</li>
              <li>Dashboard</li>
              <li>Categories</li>
              <li>Products</li>
            </ul>
          </div>

          <div className="col-md-4">
            <ul>
              <li>Suppliers</li>
              <li>Purchases</li>
              <li>Stock History</li>
              <li>Reports</li>
            </ul>
          </div>

          <div className="col-md-4">
            <ul>
              <li>Documents</li>
              <li>AWS S3 Upload</li>
              <li>Signed URL Download</li>
              <li>Production Deployment</li>
            </ul>
          </div>
        </div>
      </FormCard>
    </div>
  );
}

export default Settings;