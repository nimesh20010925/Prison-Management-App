import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Button, Modal, message } from 'antd';
import Content from "../components/Content";
import SideNavbar from "../components/SideNavbar";
import UpdateInmate from './UpdateInmate'; 
import ReleasedInmatesPDFDocument from './ReleasedInmatesPDFDocument';
import './ReleasedInmatesStyle.css';
import "./pdfStyles.css";

const fetchReleasedInmates = async () => {
    try {
        const response = await axios.get('http://localhost:3500/inmate/getreleasedinmates');
        return response.data;
    } catch (error) {
        console.error('Error fetching released inmates:', error);
        return [];
    }
};

function ReleasedInmates() {
    const [releasedInmates, setReleasedInmates] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedInmate, setSelectedInmate] = useState(null);
    const [maleCount, setMaleCount] = useState(0);
    const [femaleCount, setFemaleCount] = useState(0);
    const [isVisibleProfileModal, setIsVisibleProfileModal] = useState(false);

    const [isVisibleAddModal, setIsVisibleAddModal] = useState(false);
    const [isVisiblePDFModal, setIsVisiblePDFModal] = useState(false);
    const [isVisibleUpdateModal, setIsVisibleUpdateModal] = useState(false);
    const [currentInmates, setCurrentInmates] = useState([]);
    const [isVisibleCurrentModal, setIsVisibleCurrentModal] = useState(false); 

    useEffect(() => {
        fetchReleasedInmates().then(data => {
            setReleasedInmates(data);
            const male = data.filter(inmate => inmate.gender === 'Male').length;
            const female = data.filter(inmate => inmate.gender === 'Female').length;
            setMaleCount(male);
            setFemaleCount(female);
        });
    }, []);

    const showProfileModal = (inmate) => {
        setSelectedInmate(inmate);
        setIsVisibleProfileModal(true);
    };

    const showPDFModal = (inmate) => {
      setSelectedInmate(inmate);
      setIsVisiblePDFModal(true);
    };

    const handleCancelProfileModal = () => {
        setIsVisibleProfileModal(false);
    };

    const handleAddToCurrentList = (inmate) => {
        setSelectedInmate(inmate);
        setIsVisibleCurrentModal(true);
    };


    const filteredInmates = releasedInmates.filter(inmate => {
        if (inmate) {
            for (let key in inmate) {
                if (inmate[key] && inmate[key].toString().toLowerCase().includes(searchQuery.toLowerCase())) {
                    return true;
                }
            }
        }
        return false;
    });

    const handleUpdate = async (id, updatedData) => {
        try {
            await axios.put(`http://localhost:3500/inmate/${id}`, updatedData);
            message.success('Inmate is added to released list successfully.');
            fetchReleasedInmates().then(data => setCurrentInmates(data));
            setIsVisibleUpdateModal(false);
        } catch (error) {
            console.error('Error updating inmate details:', error);
            message.error('Failed to update inmate details.');
        }
    };

    const deleteReleasedInmate = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this released inmate?');
        if (confirmed) {
            try {
                await axios.delete(`http://localhost:3500/inmate/${id}`);
                const updatedReleasedInmates = releasedInmates.filter(inmate => inmate._id !== id);
                setReleasedInmates(updatedReleasedInmates);
                alert('Released inmate deleted successfully.');
            } catch (error) {
                console.error('Error deleting released inmate:', error);
                alert('Failed to delete released inmate.');
            }
        }
    };

    return (
        <div className="container">
            <SideNavbar />
            <Content />
            <h1 className="releasedInmates">- RELEASED INMATES -</h1>
            <div className="flexContent">
                <div className="releasedcountContainer">
                    <p>Total Released Inmates: {releasedInmates.length}</p>
                    <p>Released Male Inmates: {maleCount}</p>
                    <p>Released Female Inmates: {femaleCount}</p>
                </div>
                <div className="count">
                    <div className="releasedsearchContainer">
                        <input
                            className="releasedsearchBar"
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        
                    </div>
                </div>
            </div>


            
            <Modal
                visible={isVisibleProfileModal}
                onCancel={handleCancelProfileModal}
                footer={null}
                closeIcon={<span className="closeIcon" style={{ color: 'red' }}>X</span>}
                width={630}
                style={{ marginTop: -50}}
            >
                {selectedInmate && (
                    <div className="profileContainer">
                        <h2 className="releasedprofileTitle">- RELEASED INMATE DETAILS -</h2>
                        {selectedInmate.image ? (
                            <img className="image" src={`http://localhost:3500/uploads/${selectedInmate.image}`} alt="Inmate Photo" style={{ marginLeft: '230px', width: '120px', height: '150px' }} />
                        ) : (
                            'No Image Available'
                        )}
                        <h3 className="subtopic1">- Personal Information -</h3>
                        <div className="profile-container">
                          <div className="profile-item">
                              <strong className="profile-label">Full Name</strong>
                              <span className="profile-value">:  {selectedInmate.fullname}</span>
                          </div>
                          <div className="profile-item">
                              <strong className="profile-label">Name with Initials</strong>
                              <span className="profile-value">:  {selectedInmate.initialname}</span>
                          </div>
                          <div className="profile-item">
                              <strong className="profile-label">Date of Birth</strong>
                              <span className="profile-value">:  {selectedInmate.birthday ? new Date(selectedInmate.birthday).toISOString().split('T')[0] : ''}</span>
                          </div>
                          <div className="profile-item">
                              <strong className="profile-label">Gender</strong>
                              <span className="profile-value">:  {selectedInmate.gender}</span>
                          </div>
                          <div className="profile-item">
                              <strong className="profile-label">NIC</strong>
                              <span className="profile-value">:  {selectedInmate.nic}</span>
                          </div>
                          <div className="profile-item">
                              <strong className="profile-label">Address</strong>
                              <span className="profile-value">:  {selectedInmate.address}</span>
                          </div>
                          <div className="profile-item">
                              <strong className="profile-label">Contact Number</strong>
                              <span className="profile-value">:  {selectedInmate.contactnumber}</span>
                          </div>
                          <div className="profile-item">
                              <strong className="profile-label">Emergency Contact Name</strong>
                              <span className="profile-value">:  {selectedInmate.emergencycontactname}</span>
                          </div>
                          <div className="profile-item">
                              <strong className="profile-label">Emergency Contact Number</strong>
                              <span className="profile-value">:  {selectedInmate.emergencycontactnumber}</span>
                          </div>
                          <div className="profile-item">
                              <strong className="profile-label">Marital Status</strong>
                              <span className="profile-value">:  {selectedInmate.marital}</span>
                          </div>
                          <div className="profile-item">
                              <strong className="profile-label">Occupation</strong>
                              <span className="profile-value">:  {selectedInmate.occupation}</span>
                          </div>
                          <div className="profile-item">
                              <strong className="profile-label">Education Level</strong>
                              <span className="profile-value">:  {selectedInmate.education}</span>
                          </div>
                          <div className="profile-item">
                              <strong className="profile-label">Religion</strong>
                              <span className="profile-value">:  {selectedInmate.religion}</span>
                          </div>
                          <h3 className="subtopic2">- Admission & Release Details -</h3>
                          <div className="profile-item">
                              <strong className="profile-label">Past Inmate Number</strong>
                              <span className="profile-value">:  {selectedInmate.inmatenumber}</span>
                          </div>
                          <div className="profile-item">
                              <strong className="profile-label">The Offense Commited</strong>
                              <span className="profile-value">:  {selectedInmate.offense}</span>
                          </div>
                          <div className="profile-item">
                              <strong className="profile-label">Sentence</strong>
                              <span className="profile-value">:  {selectedInmate.sentence}</span>
                          </div>
                          <div className="profile-item">
                              <strong className="profile-label">Admission Date</strong>
                              <span className="profile-value">:  {selectedInmate.admissionDate ? new Date(selectedInmate.admissionDate).toISOString().split('T')[0] : ''}</span>
                          </div>
                          <div className="profile-item">
                              <strong className="profile-label">Estimated Release Date</strong>
                              <span className="profile-value">:  {selectedInmate.releaseDate ? new Date(selectedInmate.releaseDate).toISOString().split('T')[0] : ''}</span>
                          </div>
                          <div className="profile-item">
                              <strong className="profile-label">Estimated Sentence Duration</strong>
                              <span className="profile-value">:  {selectedInmate.years} years, {selectedInmate.months} months, {selectedInmate.days} days</span>
                          </div>
                          <div className="profile-item">
                              <strong className="profile-label">Stayed Cell Number</strong>
                              <span className="profile-value">:  {selectedInmate.cellNumber}</span>
                          </div>
                          <div className="profile-item">
                              <strong className="profile-label">Medical Conditions</strong>
                              <span className="profile-value">:  {selectedInmate.medicalConditions}</span>
                          </div>
                          <div className="profile-item">
                              <strong className="profile-label">Additional Notes</strong>
                              <span className="profile-value">:  {selectedInmate.additionalNotes}</span>
                          </div>
                          <div className="profile-item">
                              <strong className="profile-label">Released Date</strong>
                              <span className="profile-value">:  {selectedInmate.realReleaseDate ? new Date(selectedInmate.realReleaseDate).toISOString().split('T')[0] : ''}</span>
                          </div>
                          <div className="profile-item">
                              <strong className="profile-label">Reason to Release</strong>
                              <span className="profile-value">:  {selectedInmate.releaseReason}</span>
                          </div>
                          <div className="profile-item">
                              <strong className="profile-label">Release By (Officer Name)</strong>
                              <span className="profile-value">:  {selectedInmate.releaseBy}</span>
                          </div>
                          <div className="profile-item">
                              <strong className="profile-label">Release Confirmation</strong>
                              <span className="profile-value">:  {selectedInmate.confirmReleased}</span>
                          </div>
                          <div className="profile-item">
                              <strong className="profile-label">Inmate Status</strong>
                              <span className="profile-value">:  {selectedInmate.status}</span>
                          </div>
                      </div>
                      <div className="bottomContainer">

                      <button className="downloadReleasedProfile" onClick={() => showPDFModal(selectedInmate)}>Download Report</button>

                      </div>
                    </div>
                )}
            </Modal>

            <Modal
                visible={isVisibleUpdateModal}
                onCancel={() => { setIsVisibleUpdateModal(false) }}
                footer={null}
                closeIcon={<span className="closeIcon" style={{ color: 'red' }}>X</span>}
                width={600}
                style={{ marginTop: -50, marginBottom: 120 }}
            >
                {selectedInmate && (
                    <UpdateInmate
                        selectedInmate={selectedInmate}
                        updateInmate={(id, updatedData) => handleUpdate(id, updatedData)}
                        deleteInmate={deleteReleasedInmate}
                        onUpdate={(updatedData) => setSelectedInmate(updatedData)}
                        setImage={(file) => console.log('Set image:', file)} 
                    />
                )}
            </Modal>

            <Modal
                  visible={isVisiblePDFModal}
                  onCancel={() => setIsVisiblePDFModal(false)}
                  footer={null}
                  closeIcon={<span className="closeIcon" style={{ color: 'red' }}>X</span>}
                  width={800}
                >
                  {selectedInmate && <ReleasedInmatesPDFDocument selectedInmate={selectedInmate} />}
            </Modal>


            <table className="inmatesTable">
                <thead>
                    <tr>
                        <th>Inmate Photo</th>
                        <th>Full Name</th>
                        <th>Date of Birth</th>
                        <th>Gender</th>
                        <th>NIC</th>
                        <th>Address</th>
                        <th>Contact Number</th>
                        <th>Offense</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredInmates.map(inmate => (
                        <tr key={inmate._id}>
                            <td onClick={() => showProfileModal(inmate)}>
                                {inmate.image ? (
                                    <img src={`http://localhost:3500/uploads/${inmate.image}`} alt="Inmate Photo" style={{ width: '100px', height: '120px' }} />
                                ) : (
                                    'No Image Available'
                                )}
                            </td>
                            <td onClick={() => showProfileModal(inmate)}>{inmate.fullname}</td>
                            <td onClick={() => showProfileModal(inmate)}>{inmate.birthday ? new Date(inmate.birthday).toISOString().split('T')[0] : ''}</td>
                            <td onClick={() => showProfileModal(inmate)}>{inmate.gender}</td>
                            <td onClick={() => showProfileModal(inmate)}>{inmate.nic}</td>
                            <td onClick={() => showProfileModal(inmate)}>{inmate.address}</td>
                            <td onClick={() => showProfileModal(inmate)}>{inmate.contactnumber}</td>
                            <td onClick={() => showProfileModal(inmate)}>{inmate.offense}</td>
                            <td onClick={() => showProfileModal(inmate)}>{inmate.status}</td>
                            <td>
                                <button className="delete" onClick={() => deleteReleasedInmate(inmate._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ReleasedInmates;
