import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import { useStaffProfile } from '../contexts/StaffProfileContext'
import { HotelName } from '../FirestoreOperations'
import { useEffect, useState } from 'react'
import '../css/style.css'
import logo from './img/logo.png';



function Nav(){
  const { staffProfile } = useStaffProfile()
  const [hotelName, setHotelName] = useState('')
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (staffProfile && staffProfile.hotelId) {
      HotelName(staffProfile.hotelId).then(name => {
        setHotelName(name)
      })
    }
  }, [staffProfile])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  return (
    <Navbar className={`bg-pink ${scrolled ? 'scrolled' : ''}`} style={{ width: '100%', position: 'fixed', top: 0, left: 0, right: 0, transition: 'all 0.3s ease-in-out' }} >
      <Container fluid={true} >
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-between"> 
          <Navbar.Brand style={{ display: 'flex', alignItems: 'center' }} className="white-text"> 
            <img
              src={logo}
              width="100"
              height="100"
              className="d-inline-block align-top"
              alt="Logo"
              style={{ marginBottom: '20px' }}
            />
            <div>{hotelName}</div>
            </Navbar.Brand>
            <Navbar.Text style={{ lineHeight: '120px' }} className="white-text">
            {staffProfile && <Navbar.Text> Welcome, {staffProfile.fullName} !</Navbar.Text>}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Nav;