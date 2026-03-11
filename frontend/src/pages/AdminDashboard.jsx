import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getSession, logout } from "../services/auth";
import { FormLayout } from "../layouts/LoginLayout";

export default function AdminDashboard() {
  const nav = useNavigate();
  const session = getSession();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:3000/admin/applications";

  const fetchApplications = useCallback(async () => {
    if (!session?.token) {
      console.warn("No token available yet.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${session.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`Status: ${response.status}`);

      const data = await response.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <FormLayout>
      <div style={{ width: '95%', maxWidth: '1200px', margin: '0 auto', color: 'white', padding: '20px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '1.8rem', letterSpacing: '2px' }}>DASHBOARD</h1>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0 }}>Hello {session?.userId ? session.userId.substring(0, 6) : 'Admin'}</p>
            <button 
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', textDecoration: 'underline', padding: 0, fontWeight: 'bold' }}
            >
              LOGOUT
            </button>
          </div>
        </div>

        <hr style={{ borderColor: 'rgba(255,255,255,0.3)', marginBottom: '40px' }} />

        <div style={{ 
          border: '1.5px solid #fff', 
          borderRadius: '25px', 
          padding: '20px', 
          backgroundColor: 'transparent'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #fff' }}>
                <th style={{ padding: '15px', textAlign: 'left', borderRight: '1.5px solid #fff', width: '25%' }}>Username</th>
                <th style={{ padding: '15px', textAlign: 'left', borderRight: '1.5px solid #fff', width: '25%' }}>UserID</th>
                <th style={{ padding: '15px', textAlign: 'left', borderRight: '1.5px solid #fff', width: '25%' }}>Form Status</th>
                <th style={{ padding: '15px', textAlign: 'center', width: '25%' }}>View Form</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '60px', fontSize: '1.1rem' }}>
                    Loading Applications...
                  </td>
                </tr>
              ) : applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app.applicationId}>
                    <td style={{ padding: '15px', borderRight: '1.5px solid #fff' }}>{app.username || 'N/A'}</td>
                    <td style={{ padding: '15px', borderRight: '1.5px solid #fff' }}>{app.userId ? app.userId.substring(0, 6) : 'N/A'}</td>
                    <td style={{ padding: '15px', borderRight: '1.5px solid #fff' }}>{app.status}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <button 
                        onClick={() => nav(`/admin/applications/${app.applicationId}`)}
                        style={{ 
                          background: 'white', color: 'black', border: '1px solid black', 
                          padding: '6px 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' 
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '60px' }}>
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </FormLayout>
  );
}