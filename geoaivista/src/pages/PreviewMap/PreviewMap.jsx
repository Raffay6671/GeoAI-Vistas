import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../../styles/PreviewMap.module.css";
import mapPreviewImage from '../../assets/UserInput.jpg'; // Import the image

const PreviewPage = () => {
  const navigate = useNavigate();
  const [mapName, setMapName] = useState("");
  const [zoom, setZoom] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isFileSaved, setIsFileSaved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const handleRequirementForm = () => {
    if (isFileSaved) {
      navigate('/gallery', { state: { image: mapPreviewImage, name: mapName } });
    } else {
      setPopupMessage("Please save the file first.");
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
    }
  };

  const handleRegenerate = () => {
    // Logic for regenerating the map preview
    console.log("Regenerate button clicked");
  };

  const handleSaveImage = () => {
    if (mapName.trim() === "") {
      setPopupMessage("Please enter the file name first.");
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
    } else {
      // Logic for saving the image with the specified name
      console.log("Save Image clicked", mapName);
      setIsFileSaved(true);
      setPopupMessage("File Saved!");
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
    }
  };

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.1, 3)); // Max zoom level of 3
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.1, 1)); // Min zoom level of 1
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setInitialPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      e.preventDefault();
      setPosition({ x: e.clientX - initialPosition.x, y: e.clientY - initialPosition.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prevZoom) => Math.min(Math.max(prevZoom + delta, 1), 3)); // Limit zoom between 1 and 3
  };

  useEffect(() => {
    const imageElement = imageRef.current;
    if (imageElement) {
      imageElement.addEventListener('wheel', handleWheel);
      return () => {
        imageElement.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

  return (
    <div className={styles.previewContainer}>
      <div className={styles.content}>
        <h1 className={styles.previewTitle}>Preview Map</h1>
        <div
          className={styles.mapPreview}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <img
            src={mapPreviewImage}
            alt="Map Preview"
            className={styles.mapImage}
            ref={imageRef}
            style={{
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              transformOrigin: 'center center',
            }}
          />
        </div>
        <div className={styles.newControls}>
          <input
            type="text"
            placeholder="Enter map name"
            value={mapName}
            onChange={(e) => setMapName(e.target.value)}
            className={styles.mapNameInput}
          />
          <button onClick={handleSaveImage} className={styles.saveButton}>
            Save Image
          </button>
          <button onClick={handleZoomIn} className={styles.zoomButton}>
            Zoom In
          </button>
          <button onClick={handleZoomOut} className={styles.zoomButton}>
            Zoom Out
          </button>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button onClick={handleRequirementForm} className={styles.galleryButton}>
          Gallery
        </button>
        <button onClick={handleRegenerate} className={styles.regenerateButton}>
          Regenerate
        </button>
      </div>
      {showPopup && <div className={styles.popup}>{popupMessage}</div>}
    </div>
  );
};

export default PreviewPage;
