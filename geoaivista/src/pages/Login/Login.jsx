/** @format */

import { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/Login.module.css";

export default function Login() {
	const emailRef = useRef();
	const passwordRef = useRef();

	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	async function handleSubmit(e) {
		e.preventDefault();
		const email = emailRef.current.value;
		const password = passwordRef.current.value;
		console.log(email, password);
		setError("");
		setLoading(true);
		navigate("/home");
	}

	return (
		<section className={styles.main}>
			<div className={styles.left}>
				<Card className={styles.card}>
					<Card.Body>
						<h2 className="text-center mb-4">Log In</h2>
						{error && <Alert variant="danger">{error}</Alert>}
						<Form onSubmit={handleSubmit}>
							<Form.Group id="email" className={styles.formGroup}>
								<Form.Label>Email</Form.Label>
								<Form.Control type="email" ref={emailRef} required />
							</Form.Group>
							<Form.Group id="password" className={styles.formGroup}>
								<Form.Label>Password</Form.Label>
								<Form.Control type="password" ref={passwordRef} required />
							</Form.Group>
							<Button
								disabled={loading}
								className={`${styles.button} w-100`}
								type="submit">
								Log In
							</Button>
						</Form>
						<div className="w-100 text-center mt-2">
							Need an account? <Link to="/signup">Sign Up</Link>
						</div>
					</Card.Body>
				</Card>
			</div>
			<div className={styles.right}></div>
		</section>
	);
}
