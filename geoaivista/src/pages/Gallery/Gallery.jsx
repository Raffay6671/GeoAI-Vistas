import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "../../styles/Gallery.module.css";
import galleryImage1 from "../../assets/galleryimage.jpg";
import galleryImage2 from "../../assets/GalleryImage2.jpg";
import galleryImage3 from "../../assets/GalleryImage3.jpg";

const Gallery = () => {
  const location = useLocation();
  const [images, setImages] = useState([]);
  const [viewImage, setViewImage] = useState(null);

  const defaultImages = [
    { src: galleryImage1, name: "Default Image 1" },
    { src: galleryImage2, name: "Default Image 2" },
    { src: galleryImage3, name: "Default Image 3" },
  ];

  useEffect(() => {
    // Load images from localStorage when the component mounts
    const storedImages = JSON.parse(localStorage.getItem("galleryImages")) || [];
    setImages([...defaultImages, ...storedImages]);

    // Check if there's a new image passed via location state
    if (location.state?.image && location.state?.name) {
      const newImage = { src: location.state.image, name: location.state.name };
      const imageExists = storedImages.some(img => img.src === newImage.src);
      if (!imageExists) {
        const newImages = [...storedImages, newImage];
        setImages([...defaultImages, ...newImages]);
        localStorage.setItem("galleryImages", JSON.stringify(newImages));
      }
    }
  }, [location.state]);

  const handleView = (image) => {
    setViewImage(image.src);
  };

  const handleDownload = (image) => {
    const link = document.createElement("a");
    link.href = image.src;
    link.download = `${image.name}.jpg`; // Use the image name for the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (index) => {
    const imageToDelete = images[index];
    const newImages = images.filter((_, i) => i !== index);

    // If the image is not one of the default images, update localStorage
    if (!defaultImages.some(img => img.src === imageToDelete.src)) {
      const storedImages = JSON.parse(localStorage.getItem("galleryImages")) || [];
      const updatedStoredImages = storedImages.filter((img) => img.src !== imageToDelete.src);
      localStorage.setItem("galleryImages", JSON.stringify(updatedStoredImages));
    }

    setImages(newImages);
  };

  return (
    <section className={styles.section}>
      <h1>Gallery</h1>
      <div className={styles.cardContainer}>
        {images.map((image, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img src={image.src} alt="placeholder" />
              <div className={styles.imageOverlay}>
                <div className={styles.imageName}>{image.name}</div>
              </div>
            </div>
            <div className={styles.cardContent}>
              <button className={styles.button} onClick={() => handleView(image)}>
                View
              </button>
              <button className={styles.button} onClick={() => handleDownload(image)}>
                Download
              </button>
              <button className={styles.button} onClick={() => handleDelete(index)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {viewImage && (
        <div className={styles.modal} onClick={() => setViewImage(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <span className={styles.close} onClick={() => setViewImage(null)}>
              &times;
            </span>
            <img src={viewImage} alt="view" className={styles.modalImage} />
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
