import React from 'react';
import styles from "../../styles/RequirementForm.module.css";

const RequirementForm = () => {
  return (
    <div className={styles.background}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Land Use Planning Requirements</h1>
        <p className={styles.subtitle}>Select the type of residential density for your land planning project.</p>
        
        <div className={styles.optionsContainer}>
          <div className={styles.option}>
            <img src="src\assets\DenseResidential.png" alt="Dense Residential" className={styles.icon} />
            <h2>Dense Residential</h2>
            <p>High-density housing with multiple units per acre.</p>
          </div>
          
          <div className={styles.option}>
            <img src="src\assets\MediumResidential.jpg" alt="Medium Residential" className={styles.icon} />
            <h2>Medium Residential</h2>
            <p>Moderate-density housing with a balanced mix of units.</p>
          </div>
          
          <div className={styles.option}>
            <img src="src\assets\SparseImage.jpg" alt="Sparse Residential" className={styles.icon} />
            <h2>Sparse Residential</h2>
            <p>Low-density housing with few units per acre.</p>
          </div>
        </div>
        
        <button className={styles.submitButton}>Submit</button>
      </div>
    </div>
  );
};

export default RequirementForm;
