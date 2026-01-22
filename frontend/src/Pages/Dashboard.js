import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Gavel, Users, FileText, Package, LogOut, 
  Search, Plus, Menu, IndianRupee, Monitor 
} from 'lucide-react';
import StaffModal from './StaffModal';
import StaffTable from '../Pages/StaffTable';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Get API URL from .env (with a fallback just in case)
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const [activeTab, setActiveTab] = useState('Asthapana'); 
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Fetch Data using the .env variable
  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/staff`);
      setStaff(res.data);
    } catch (err) { 
      console.error("Error fetching data:", err); 
    }
  };

  useEffect(() => { 
    if(activeTab === 'Asthapana') fetchStaff(); 
  }, [activeTab]);

  // Handle Logout
  const handleLogout = () => {
    if (window.confirm("तुम्ही लॉगआउट करू इच्छिता?")) {
      localStorage.removeItem('isAuthenticated');
      navigate('/'); 
    }
  };

  // Delete using the .env variable
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`${API_BASE_URL}/staff/${id}`);
        fetchStaff(); 
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete the record.");
      }
    }
  };

  const handleOpenModal = (type, data = null) => {
    setModalType(type);
    setSelectedStaff(data);
    setIsModalOpen(true);
  };

  const filteredStaff = staff.filter(s => 
    s.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.Post?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-wrapper">
      {/* SIDEBAR */}
      <aside className="sidebar" style={{ width: isCollapsed ? '80px' : '280px' }}>
        <div className="sidebar-brand">
          <Gavel color="#2dd4bf" size={28} />
          {!isCollapsed && <span className="brand-text">न्यायालय</span>}
        </div>

        <nav className="nav-container">
          <button className={`nav-item ${activeTab === 'Asthapana' ? 'active' : ''}`} onClick={() => setActiveTab('Asthapana')}>
            <Users size={20} />
            {!isCollapsed && <span style={{marginLeft: '12px'}}>आस्थापणा विभाग</span>}
          </button>
          <button className="nav-item">
            <FileText size={20} />
            {!isCollapsed && <span style={{marginLeft: '12px'}}>अर्ज व्यवस्थापन</span>}
          </button>
          <button className="nav-item">
            <Package size={20} />
            {!isCollapsed && <span style={{marginLeft: '12px'}}>मुद्देमाल</span>}
          </button>
          
          <div style={{marginTop: 'auto'}}>
            <button 
              className="nav-item logout-btn" 
              onClick={handleLogout}
              style={{color: '#f87171', width: '100%', border: 'none', background: 'none', cursor: 'pointer'}}
            >
              <LogOut size={20} />
              {!isCollapsed && <span style={{marginLeft: '12px'}}>बाहेर पडा</span>}
            </button>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="main-area">
        <header className="top-header">
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="toggle-btn">
              <Menu size={22} />
            </button>
            <h2 style={{fontSize: '18px', margin: 0}}>जिल्हा व सत्र न्यायालय नाशिक</h2>
          </div>
          <div className="user-profile">
            <div className="avatar">A</div>
            {!isCollapsed && <span style={{fontWeight: '600', fontSize: '14px', marginLeft: '8px'}}>Admin</span>}
          </div>
        </header>

        <main style={{padding: '30px'}}>
          <div className="vibhag-tabs">
            <button className={`tab-btn ${activeTab === 'Asthapana' ? 'active' : ''}`} onClick={() => setActiveTab('Asthapana')}>
              आस्थापणा विभाग
            </button>
            <button className={`tab-btn ${activeTab === 'PayBill' ? 'active' : ''}`} onClick={() => setActiveTab('PayBill')}>
              कर्मचारी माहिती
            </button>
          </div>

          {activeTab === 'Asthapana' ? (
            <div className="table-wrapper">
              <div className="table-header">
                <h3 style={{margin:0}}>कर्मचारी नोंदवही</h3>
                <div style={{display:'flex', gap:'10px'}}>
                  <div className="search-box">
                    <Search size={18} color="#94a3b8" />
                    <input 
                      type="text" 
                      placeholder="शोधा..." 
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{border:'none', outline:'none', background:'none', marginLeft:'10px'}}
                    />
                  </div>
                  <button className="add-btn" onClick={() => handleOpenModal('add')}>
                    <Plus size={18} /> नवीन नोंद
                  </button>
                </div>
              </div>
              
              <StaffTable 
                data={filteredStaff}
                onEdit={(item) => handleOpenModal('edit', item)}
                onInfo={(item) => handleOpenModal('info', item)}
                onDelete={handleDelete} 
              />
            </div>
          ) : (
            <div className="placeholder-card" style={{textAlign: 'center', padding: '50px'}}>
              <Monitor size={48} color="#cbd5e1" />
              <h3>{activeTab} विभाग</h3>
              <p>ही माहिती लवकरच उपलब्ध होईल.</p>
            </div>
          )}
        </main>
      </div>

      {isModalOpen && (
        <StaffModal 
          type={modalType} 
          data={selectedStaff} 
          onClose={() => setIsModalOpen(false)} 
          refresh={fetchStaff} 
          apiUrl={API_BASE_URL} // Optional: Pass API URL to modal too
        />
      )}
    </div>
  );
};

export default Dashboard;