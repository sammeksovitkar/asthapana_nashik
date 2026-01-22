import React from 'react';
import { Edit, Trash2, CalendarDays, Info } from 'lucide-react';

const StaffTable = ({ data, onEdit, onDelete, onInfo, onELView }) => {
  if (data.length === 0) {
    return (
      <div className="no-data-message">
        कोणतीही माहिती सापडली नाही. (No records found)
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="staff-data-table">
        <thead>
          <tr>
            <th style={{ width: '50px' }}>अ.क्र. (S.N.)</th> {/* Serial Number Column */}
            <th>कर्मचाऱ्याचे नाव (Name)</th>
            <th>हुद्दा (Post)</th>
            <th>मूळ वेतन (Salary)</th>
            <th>CL शिल्लक (CL Bal)</th>
            <th>EL एकूण (EL Count)</th>
            <th style={{ textAlign: 'center' }}>कृती (Actions)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            // Calculate EL Count safely
            const elCount = Array.isArray(item.EL_Dates) ? item.EL_Dates.length : 0;
            
            return (
              <tr key={item.id || index}>
                {/* Serial Number Cell - Index starts at 0, so we add 1 */}
                <td style={{ fontWeight: '600', color: '#64748b' }}>{index + 1}</td>
                
                <td><b>{item.Name}</b></td>
                <td>
                  <span className="post-badge">{item.Post}</span>
                </td>
                <td>₹{item.Salary}</td>
                <td>
                  <span style={{ 
                    fontWeight: 'bold', 
                    color: item.BalanceCL <= 2 ? '#ef4444' : '#10b981',
                    background: item.BalanceCL <= 2 ? '#fee2e2' : '#f0fdf4',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}>
                    {item.BalanceCL || 0} / 8
                  </span>
                </td>
                
                <td>
                  <span style={{
                    fontWeight: 'bold',
                    background: '#e0e7ff',
                    color: '#4338ca',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '13px'
                  }}>
                    {elCount} Days
                  </span>
                </td>

                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                   
                    <button className="icon-btn info" onClick={() => onInfo(item)} title="Info">
                      <Info size={18} />
                    </button>

                    <button className="icon-btn edit" onClick={() => onEdit(item)} title="Edit">
                      <Edit size={18} />
                    </button>

                    <button className="icon-btn delete" onClick={() => onDelete(item.id)} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StaffTable;