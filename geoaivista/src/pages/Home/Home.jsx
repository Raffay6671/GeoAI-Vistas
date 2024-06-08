/** @format */

// pages/Home/Home.jsx
import { useState } from "react";
import { Container, Form, FormGroup, Button, Row, Col, ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Home.module.css";

const Home = () => {
	const [image, setImage] = useState(null);
	const [progress, setProgress] = useState(0);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const navigate = useNavigate();

	const handleImageChange = (e) => {
		setImage(e.target.files[0]);
		setProgress(50); // Example progress value
	};

	const handleUpload = () => {
		if (image) {
			// Simulate file upload
			setTimeout(() => {
				setUploadedFiles([...uploadedFiles, image.name]);
				setProgress(100);
				setImage(null);
			}, 1000);
		}
	};

	const handlePreview = () => {
		navigate("/preview");
	};

	return (
		<section className={styles.homesection}>
			<Container className={styles.container}>
				<h1 className={styles.h1}>Upload</h1>
				<Form>
					<FormGroup className="mb-3">
						<div className={styles.dropArea}>
							<Form.Label className={styles.dropText}>
								Drag & drop files or <span className={styles.browseText}>Browse</span>
							</Form.Label>
							<Form.Control type="file" onChange={handleImageChange} className={styles.fileInput} />
						</div>
						<Form.Text className={styles.textDark}>
							Supported formats: JPEG, PNG
						</Form.Text>
					</FormGroup>
					{image && (
						<div className={styles.progressWrapper}>
							<ProgressBar animated now={progress} label={`${image.name}`} />
						</div>
					)}
					{uploadedFiles.length > 0 && (
						<div className={styles.uploadedList}>
							<h5>Uploaded</h5>
							{uploadedFiles.map((file, index) => (
								<div key={index} className={styles.uploadedFile}>
									{file}
								</div>
							))}
						</div>
					)}
					<Button onClick={handleUpload} className={styles.uploadButton}>
						UPLOAD FILES
					</Button>
				</Form>
			</Container>
			<div className={styles.previewButtonContainer}>
				<Button onClick={handlePreview} className={styles.previewButton}>
					Preview>>
				</Button>
			</div>
		</section>
	);
};

export default Home;
