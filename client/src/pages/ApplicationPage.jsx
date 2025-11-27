import React from 'react';
import { useNavigate } from 'react-router-dom';
import ctuLogo from '../img/ctu_logo.png';
import bpLogo from '../img/bp_logo.png';

const classifications = [
    {
        title: 'New/Freshman Applicant',
        description: `Applicant is any of the following:
            1. Fresh Senior High School graduate
            2. 4th year HS graduate (BEC curriculum)
            3. ALS or PEPT Certificate Holders
            4. New ETEEAP enrollee`,
    },
    {
        title: 'Transferee from Another School',
        description: 'Applicant was previously enrolled in college from another school and intends to continue his or her enrollment in CTU Daanbantayan Campus.',
    },
    {
        title: 'Cross-Enrollee',
        description: 'Applicant is enrolled in another school where some identified courses are not available, thus, enroll those courses in CTU Daanbantayan Campus.',
    },
    {
        title: 'Second Courser',
        description: `Applicant has graduated and obtained a bachelor's degree from another school and intends to pursue a new program in CTU Daanbantayan Campus.`,
    },
    {
        title: 'Returnee',
        description: 'Applicant was previously enrolled in CTU Daanbantayan Campus and was unable to continue his or her succeeding school terms and intends to enroll again.',
    },
];

const ApplicationPage = () => {
    const navigate = useNavigate();

    const handleClassificationClick = (title) => {
        if (title === 'New/Freshman Applicant') {
            navigate('/signup');
        } else {
            alert(`You selected: ${title}`);
        }
    };

    return (
        <div className="container">
            <div className=" application-container">
                <div className="application-header-logos">
                    <img src={bpLogo} alt="BP Logo" className="application-logo" />
                    <span className="application-campus-title" style={{ color: 'var(--gold, #f9b233)' }}>
                        Cebu Technological University<br />Daanbantayan Campus
                    </span>
                    <img src={ctuLogo} alt="CTU Logo" className="application-logo" />
                </div>
                <h3 className="application-subtitle">Online Application for New/Transferee/Returnee Students</h3>
                <p className="application-instructions">
                    <strong>Read carefully each classification's details.</strong> If you are not sure of your classification, ask assistance from your Program Chairperson, the Campus Registrar, or click the link below for contact details.<br />
                </p>
                <a
                    href="https://www.ctu.edu.ph/daanbantayan-campus/"
                    className="application-link"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    CTU Daanbantayan Campus Contact Details
                </a>
                <h4 className="application-subtitle">Please Choose Your Classification Below</h4>
                <div className="application-classifications">
                    {classifications.map((c) => (
                        <button
                            key={c.title}
                            className="application-classification-btn"
                            onClick={() => handleClassificationClick(c.title)}
                        >
                            <div className="application-classification-title">{c.title}</div>
                            <div className="application-classification-desc">{c.description}</div>
                        </button>
                    ))}
                </div>
                <div className="application-login-reminder">
                    Please login right away using your CTU Daanbantayan Campus enrollment access credentials.<br />
                    For assistance, contact the Registrar's Office.
                </div>
            </div>
        </div>
    );
};

export default ApplicationPage;
