import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../../styles/PreviewMap.module.css";


const PreviewPage = () => {
  const navigate = useNavigate();

  const handleRequirementForm = () => {
    navigate('/requirementform');
  };

  return (
    <div className={styles.previewContainer}>
      <div className={styles.content}>
        <h1>Preview Map</h1>
        <div className={styles.mapPreview}>
          {/* Add your map preview content here */}
        </div>
      </div>
      <button onClick={handleRequirementForm} className={styles.requirementButton}>
        RequirementForm >>
      </button>
    </div>
  );
};

export default PreviewPage;
