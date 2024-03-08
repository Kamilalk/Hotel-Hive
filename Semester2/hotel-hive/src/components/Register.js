import { useRef, useState} from "react";
import {Form, Button, Card, Alert} from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContexts'
import { Link, useHistory } from 'react-router-dom'
import { StaffProfile } from "../objects/StaffProfile"
import { useStaffProfile } from "../contexts/StaffProfileContext"

export default function Register() {

    const fullNameRef = useRef()
    const emailRef = useRef()
    const hotelNameRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()
    const {register} = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    const {profileRegister} = useStaffProfile()

    async function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== confirmPasswordRef.current.value){
            return setError('passwords do not match')
        }

        try{
            setError('')
            setLoading(true)
            const uid = await register(emailRef.current.value, passwordRef.current.value)

            const staffProfile = new StaffProfile(uid, fullNameRef.current.value, emailRef.current.value);

            const hotelName = hotelNameRef.current.value
        
            await profileRegister(staffProfile, hotelName)

            history.push('/')

            //reset fields
            fullNameRef.current.value = ''
            emailRef.current.value = ''
            hotelNameRef.current.value = ''
            passwordRef.current.value = ''
            confirmPasswordRef.current.value = ''
        } catch {
            setError('Failed to create an account')
        }

        setLoading(false)
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Register</h2>
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
                        <Form.Group id="hotelName">
                            <Form.Label>Hotel Name</Form.Label>
                            <Form.Control type="text" ref={hotelNameRef} required/>
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
            <div className="w-100 text-center mt-2">
                Already have an account? <Link to="/login" >Login</Link>
            </div>
        </>
    )
}

