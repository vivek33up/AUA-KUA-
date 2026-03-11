import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "../services/auth";
import { FormLayout, Title } from "../layouts/LoginLayout";

export default function AdminViewApplication() {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    async function fetchApp() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/admin/applications/${id}`, {
          headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        const data = await res.json();
        setApp(data && !data.error ? data : null);
      } catch (e) { setApp(null); }
      setLoading(false);
    }
    fetchApp();
  }, [id]);

  return (
    <FormLayout>
      <div style={{ maxWidth: '800px', margin: '40px auto', backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
        
        {/* Header */}
        <div style={{ backgroundColor: '#1a1a1a', padding: '40px 20px 20px', textAlign: 'center', position: 'relative' }}>
          <div style={{ width: '60px', height: '60px', backgroundColor: '#fbdf07', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', border: '4px solid #1a1a1a' }}>
            <span style={{ fontSize: '30px' }}>👤</span>
          </div>
          <Title style={{ color: '#fff' }}>Application Details</Title>
          <p style={{ color: '#aaa' }}>Reviewing user submission</p>
        </div>

        {/* Content */}
        <div style={{ padding: '30px', color: '#333' }}>
          {loading ? (
            <p style={{ textAlign: 'center' }}>Loading details...</p>
          ) : !app ? (
            <p style={{ textAlign: 'center' }}>Application not found.</p>
          ) : (
            <>
              <div style={{ marginBottom: '30px' }}>
                <p><strong>Applicant:</strong> {app.username}</p>
                <p><strong>Application ID:</strong> {app.applicationId ? app.applicationId : 'N/A'}</p>
                <p><strong>Status:</strong> <span style={{ color: 'green', fontWeight: 'bold' }}>{app.status}</span></p>
              </div>

              <h3 style={{ borderBottom: '2px solid #fbdf07', paddingBottom: '10px' }}>Form Responses</h3>

              <div style={{ marginTop: '20px' }}>
                {app.answers.map((ans, idx) => (
                  <div key={idx} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
                    {/* Displaying Question Text instead of ID */}
                    <div style={{ fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>
                      {ans.questionText} 
                    </div>
                    <div style={{ color: '#333' }}>
                      {ans.fieldType === 'file' ? (
                        <a href={`${app.fileBaseUrl}${ans.answer}`} target="_blank" rel="noreferrer" style={{ color: '#007bff', fontWeight: 'bold' }} download>
                          View Document 📄
                        </a>
                      ) : (
                        ans.answer || <em>No answer</em>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <button 
            onClick={() => nav("/admin")} 
            style={{ width: '100%', marginTop: '20px', padding: '12px', backgroundColor: '#666', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </FormLayout>
  );
}