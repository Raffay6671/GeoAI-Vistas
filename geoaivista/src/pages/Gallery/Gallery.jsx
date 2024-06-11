/** @format */

import { useState } from "react";
import styles from "../../styles/Gallery.module.css";
import galleryImage from "../../assets/galleryimage.jpg";

const Gallery = () => {
	const [images, setImages] = useState([
		galleryImage,
		galleryImage,
		galleryImage,
		galleryImage,
		galleryImage,
	]);

	const [viewImage, setViewImage] = useState(null);

	const handleView = (image) => {
		setViewImage(image);
	};

	const handleDownload = (image) => {
		const link = document.createElement("a");
		link.href = image;
		link.download = "image.jpg"; // You can set the desired file name here
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleDelete = (index) => {
		const newImages = images.filter((_, i) => i !== index);
		setImages(newImages);
	};

	return (
		<section className={styles.section}>
			<h1>Gallery</h1>
			<div className={styles.cardContainer}>
				{images.map((image, index) => (
					<div key={index} className={styles.card}>
						<img src={image} alt="placeholder" />
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

