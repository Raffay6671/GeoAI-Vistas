import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../../styles/RequirementForm.module.css";

const RequirementForm = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const navigate = useNavigate();

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    console.log('Selected Option:', selectedOption);
    navigate('/preview', { state: { selectedOption } });
  };

  return (
    <div className={styles.background}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Land Use Planning Requirements</h1>
        <p className={styles.subtitle}>Select the type of residential density for your land planning project.</p>
        
        <div className={styles.optionsContainer}>
          <div 
            className={`${styles.option} ${selectedOption === 'Dense Residential' ? styles.selected : ''}`} 
            onClick={() => handleOptionClick('Dense Residential')}
          >
            <img src="src/assets/DenseResidential.png" alt="Dense Residential" className={styles.icon} />
            <h2>Dense Residential</h2>
            <p className={styles.optionSub}>High-density housing with multiple units per acre.</p>
          </div>
          
          <div 
            className={`${styles.option} ${selectedOption === 'Medium Residential' ? styles.selected : ''}`} 
            onClick={() => handleOptionClick('Medium Residential')}
          >
            <img src="src/assets/MediumResidential.jpg" alt="Medium Residential" className={styles.icon} />
            <h2>Medium Residential</h2>
            <p className={styles.optionSub}>Moderate-density housing with a balanced mix of units.</p>
          </div>
          
          <div 
            className={`${styles.option} ${selectedOption === 'Sparse Residential' ? styles.selected : ''}`} 
            onClick={() => handleOptionClick('Sparse Residential')}
          >
            <img src="src/assets/SparseImage.jpg" alt="Sparse Residential" className={styles.icon} />
            <h2>Sparse Residential</h2>
            <p className={styles.optionSub}>Low-density housing with few units per acre.</p>
          </div>
        </div>
        
        <button className={styles.submitButton} onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default RequirementForm;
