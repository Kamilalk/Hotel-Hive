import { useState, useRef } from "react";
import { Form, Button, Card, Alert } from 'react-bootstrap';
import Nav from '../Nav';
import { StaffProfile } from "../../objects/StaffProfile"
import { auth } from '../../firebase'
import { AddUserProfile } from "../../FirestoreOperations";
import { useStaffProfile } from '../../contexts/StaffProfileContext'

const AddStaff = () => {
    const fullNameRef = useRef();
    const emailRef = useRef();
    const staffRoleRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { staffProfile } = useStaffProfile();

    async function handleSubmit(e) {
        e.preventDefault();

        if (passwordRef.current.value !== confirmPasswordRef.current.value){
            return setError('Passwords do not match');
        }

        try {
            setError('');
            setLoading(true);
            
            const { user } = await auth.createUserWithEmailAndPassword(
                emailRef.current.value,
                passwordRef.current.value
            );

            const uid = user.uid;

            const profile = new StaffProfile(
                uid,
                fullNameRef.current.value,
                emailRef.current.value,
                staffRoleRef.current.value
            );

            // Get hotelId from staffProfile
            const hotelId = staffProfile.hotelId;
        
            await AddUserProfile(profile, hotelId);

            // Reset fields
            fullNameRef.current.value = '';
            emailRef.current.value = '';
            passwordRef.current.value = '';
            confirmPasswordRef.current.value = '';
            staffRoleRef.current.value = '';
            
            await auth.signOut();
        } catch {
            setError('Failed to create an account');
        }

        setLoading(false);
    }

    return (
        <>
            <Nav fixed="top" style={{ position: 'fixed', top: 0 }} />
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Add Staff</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="fullName">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="text" ref={fullNameRef} required/>
                        </Form.Group>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required/>
                        </Form.Group>
                        <Form.Group id="staffRole">
                            <Form.Label>Staff Role</Form.Label>
                            <Form.Control as="select" ref={staffRoleRef} required>
                                <option value="">Select Role</option>
                                <option value="Manager">Manager</option>
                                <option value="Supervisor">Supervisor</option>
                                <option value="Housekeeper">Housekeeper</option>
                                <option value="Handyman">Handyman</option>
                                <option value="Porter">Porter</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required/>
                        </Form.Group>
                        <Form.Group id="confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" ref={confirmPasswordRef} required/>
                        </Form.Group>
                        <Button disabled={loading} className="w-100" type="submit">Sign up</Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    );
};

export default AddStaff;