import { useRef, useState} from "react";
import {Form, Button, Card, Alert} from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContexts'
import {Link, useHistory} from 'react-router-dom'
import { useStaffProfile } from "../contexts/StaffProfileContext"


export default function Login() {

    const emailRef = useRef()
    const {login} = useAuth()
    const passwordRef = useRef()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    const { profileLogin } = useStaffProfile()

    async function handleSubmit(e) {
        e.preventDefault()

        try{
            setError('')
            setLoading(true)
            const userCredential = await login(emailRef.current.value, passwordRef.current.value);
            await profileLogin(userCredential)
            history.push('/')
        } catch {
            setError('Failed to create an account')
        }

        setLoading(false)
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Log In</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required/>
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required/>
                        </Form.Group>
                        <Button disabled={loading} className="w-100" type="submit">Log In</Button>
                    </Form>
                    <div className="w-100 text-center mt-3">
                        <Link to="/forgot-passsword">Forgot Password?</Link>
                    </div>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Need an account? <Link to="/register">Sign Up</Link>
            </div>
        </>
    )
}
