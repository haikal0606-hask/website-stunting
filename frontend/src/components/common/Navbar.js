import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CustomNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          🩺 Stunting Prevention
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">🏠 Home</Nav.Link>
            <Nav.Link as={Link} to="/articles">📚 Artikel</Nav.Link>
            <Nav.Link as={Link} to="/quiz">❓ Kuis</Nav.Link>
          </Nav>
          
          <Nav>
            {user ? (
              <NavDropdown title={`👋 ${user.name}`} id="user-dropdown" align="end">
                <NavDropdown.Item as={Link} to="/profile">
                  👤 Profil Saya
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/articles">
                  📖 Artikel Saya
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/quiz">
                  🎯 Hasil Kuis
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  🚪 Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">🔐 Login</Nav.Link>
                <Nav.Link as={Link} to="/register">📝 Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;