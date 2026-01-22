import React, { useState } from 'react';
import axios from 'axios';
import { 
  X, Save, User, Calendar, Briefcase, IndianRupee, 
  CheckCircle, Clock, Plus, Trash2, ShieldCheck, Info
} from 'lucide-react';

const StaffModal = ({ type, data, onClose, refresh }) => {
  const [formData, setFormData] = useState({
    id: data?.id || null,
    Name: data?.Name || '',
    Post: data?.Post || '',
    Salary: data?.Salary || '',
    ApptDate: data?.ApptDate || '',
    OfficeJoinDate: data?.OfficeJoinDate || '',
    TotalCL: 8,
    TakenCL: data?.TakenCL || 0,
    EL_Dates: data?.EL_Dates || []
  });

  const balanceCL = 8 - (Number(formData.TakenCL) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, BalanceCL: balanceCL };
      if (type === 'add') await axios.post('http://localhost:5000/api/staff', payload);
      else await axios.put(`http://localhost:5000/api/staff/${data.id}`, payload);
      refresh();
      onClose();
    } catch (error) {
      alert("Error saving data");
    }
  };

  const handleAddELDate = (e) => {
    const selectedDate = e.target.value;
    if (selectedDate && !formData.EL_Dates.includes(selectedDate)) {
      setFormData({ ...formData, EL_Dates: [...formData.EL_Dates, selectedDate] });
    }
  };

  const removeELDate = (date) => {
    setFormData({ ...formData, EL_Dates: formData.EL_Dates.filter(d => d !== date) });
  };

  // --- 1. MODERN VIEW INFO MODAL ---
  if (type === 'info') {
    return (
      <div className="modal-overlay">
        <div className="modal-container" style={{maxWidth: '550px', borderRadius: '24px', overflow: 'hidden'}}>
          <div style={{background: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%)', padding: '40px 30px', color: 'white', position: 'relative'}}>
             <button onClick={onClose} style={{position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', padding: '8px', color: 'white', cursor: 'pointer'}}><X size={20}/></button>
             <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
                <div style={{width: '80px', height: '80px', borderRadius: '20px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyCenter: 'center', backdropFilter: 'blur(10px)'}}>
                   <User size={45} style={{margin: '0 auto'}}/>
                </div>
                <div>
                   <h2 style={{margin: 0, fontSize: '24px', letterSpacing: '-0.5px'}}>{data?.Name}</h2>
                   <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px', opacity: 0.9}}>
                      <ShieldCheck size={16}/>
                      <span style={{fontSize: '14px', fontWeight: 500}}>{data?.Post}</span>
                   </div>
                </div>
             </div>
          </div>
          
          <div style={{padding: '30px', background: '#fff'}}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
               <InfoCard icon={<IndianRupee size={16}/>} label="मूळ वेतन" value={`₹${data?.Salary || 0}`} color="#4f46e5" />
               <InfoCard icon={<CheckCircle size={16}/>} label="CL शिल्लक" value={`${data?.BalanceCL || balanceCL} / 8`} color="#10b981" />
               <InfoCard icon={<Calendar size={16}/>} label="नियुक्ती तारीख" value={data?.ApptDate || '---'} color="#f59e0b" />
               <InfoCard icon={<Clock size={16}/>} label="हजर तारीख" value={data?.OfficeJoinDate || '---'} color="#ef4444" />
            </div>

            <div style={{marginTop: '25px'}}>
               <h4 style={{fontSize: '12px', color: '#64748b', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px'}}>
                  <Plus size={14}/> अर्जित रजा तपशील (EL History)
               </h4>
               <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                  {data?.EL_Dates?.length > 0 ? data.EL_Dates.map(d => (
                    <span key={d} style={{background: '#f1f5f9', color: '#1e293b', padding: '6px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, border: '1px solid #e2e8f0'}}>{d}</span>
                  )) : <div style={{color: '#94a3b8', fontSize: '13px', fontStyle: 'italic'}}>कोणतीही नोंद आढळली नाही.</div>}
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. ATTRACTIVE ADD / EDIT FORM ---
  return (
    <div className="modal-overlay">
      <div className="modal-container large" style={{borderRadius: '24px', border: 'none'}}>
        <div style={{padding: '25px 30px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2 style={{margin: 0, fontSize: '20px', color: '#1e293b'}}>{type === 'edit' ? 'कर्मचारी माहिती संपादित करा' : 'नवीन कर्मचारी नोंदणी'}</h2>
          <button onClick={onClose} className="close-x"><X /></button>
        </div>

        <form onSubmit={handleSubmit} style={{padding: '30px', background: '#fff'}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px'}}>
            
            <div className="form-group">
               <label className="modern-label"><User size={16}/> नाव (Full Name)</label>
               <input name="Name" value={formData.Name} onChange={(e)=>setFormData({...formData, Name: e.target.value})} className="modern-input" placeholder="उदा. राजेश शर्मा" required />
            </div>

            <div className="form-group">
               <label className="modern-label"><Briefcase size={16}/> हुद्दा (Designation)</label>
               <input name="Post" value={formData.Post} onChange={(e)=>setFormData({...formData, Post: e.target.value})} className="modern-input" placeholder="उदा. वरिष्ठ लिपिक" />
            </div>

            <div className="form-group">
               <label className="modern-label"><IndianRupee size={16}/> वेतन (Monthly Salary)</label>
               <input name="Salary" type="number" value={formData.Salary} onChange={(e)=>setFormData({...formData, Salary: e.target.value})} className="modern-input" />
            </div>

            <div className="form-group">
               <label className="modern-label"><CheckCircle size={16}/> घेतलेली CL रजा</label>
               <input name="TakenCL" type="number" value={formData.TakenCL} onChange={(e)=>setFormData({...formData, TakenCL: e.target.value})} className="modern-input" max="8" />
            </div>

            <div className="form-group">
               <label className="modern-label"><Calendar size={16}/> नियुक्ती तारीख</label>
               <input name="ApptDate" type="date" value={formData.ApptDate} onChange={(e)=>setFormData({...formData, ApptDate: e.target.value})} className="modern-input" />
            </div>

            <div className="form-group">
               <label className="modern-label"><Clock size={16}/> कार्यालय हजर तारीख</label>
               <input name="OfficeJoinDate" type="date" value={formData.OfficeJoinDate} onChange={(e)=>setFormData({...formData, OfficeJoinDate: e.target.value})} className="modern-input" />
            </div>

            <div className="full-width" style={{background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0'}}>
               <label className="modern-label" style={{marginBottom: '15px'}}><Plus size={16}/> अर्जित रजा व्यवस्थापन (EL Management)</label>
               <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
                  <input type="date" onChange={handleAddELDate} className="modern-input" style={{width: '200px', background: '#fff'}} />
                  <div style={{fontSize: '12px', color: '#64748b', alignSelf: 'center'}}>* रजा जोडण्यासाठी तारीख निवडा</div>
               </div>
               <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                  {formData.EL_Dates.map(d => (
                    <span key={d} className="modern-tag">
                      {d} <X size={14} onClick={() => removeELDate(d)} style={{cursor: 'pointer'}}/>
                    </span>
                  ))}
               </div>
            </div>
          </div>

          <div style={{marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'flex-end'}}>
             <button type="button" onClick={onClose} style={{padding: '12px 25px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 'bold', cursor: 'pointer'}}>रद्द करा</button>
             <button type="submit" style={{padding: '12px 35px', borderRadius: '12px', border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'}}>
                <Save size={18}/> माहिती जतन करा
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper Component for Info View
const InfoCard = ({ icon, label, value, color }) => (
  <div style={{padding: '15px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9'}}>
     <div style={{display: 'flex', alignItems: 'center', gap: '6px', color: color, marginBottom: '5px'}}>
        {icon} <span style={{fontSize: '11px', fontWeight: 800, textTransform: 'uppercase'}}>{label}</span>
     </div>
     <div style={{fontSize: '16px', fontWeight: 700, color: '#1e293b'}}>{value}</div>
  </div>
);

export default StaffModal;