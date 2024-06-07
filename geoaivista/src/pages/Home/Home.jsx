/** @format */

// pages/Home.js
import { useState } from "react";
import { Container, Form, FormGroup, Button } from "react-bootstrap";
import styles from "../../styles/Home.module.css";

const Home = () => {
	const [image, setImage] = useState(null);

	const handleImageChange = (e) => {
		setImage(e.target.files[0]);
	};

	const handleUpload = () => {
		console.log(image);
	};

	return (
		<section className={styles.homesection}>
			<Container className={styles.container}>
				<h1 className={styles.h1}>Upload PNG Image</h1>
				<Form>
					<FormGroup>
						<Form.Label>Choose Image</Form.Label>
						<Form.Control type="file" onChange={handleImageChange} />
					</FormGroup>
					<Button onClick={handleUpload}>Upload</Button>
				</Form>
			</Container>
		</section>
	);
};

export default Home;
