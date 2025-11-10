import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <Card.Body className="text-center">
                <h4>Anda belum login</h4>
                <p className="text-muted">Silakan login untuk melihat profil</p>
                <Button variant="primary" onClick={() => navigate('/login')}>
                  Login
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body>
              <div className="text-center mb-4">
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    backgroundColor: '#0d6efd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '2.5rem',
                    margin: '0 auto',
                    marginBottom: '1rem'
                  }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <h3>{user.name}</h3>
                <Badge bg="primary" className="mb-2">
                  👨‍🎓 Siswa SMA
                </Badge>
              </div>

              <Card className="mb-4">
                <Card.Body>
                  <h5>📋 Informasi Profil</h5>
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td><strong>Nama Lengkap</strong></td>
                        <td>{user.name}</td>
                      </tr>
                      <tr>
                        <td><strong>Email</strong></td>
                        <td>{user.email}</td>
                      </tr>
                      <tr>
                        <td><strong>Sekolah</strong></td>
                        <td>{user.school || 'SMA Negeri 1 Banda Aceh'}</td>
                      </tr>
                      <tr>
                        <td><strong>Kota/Kabupaten</strong></td>
                        <td>{user.city || 'Banda Aceh'}</td>
                      </tr>
                      <tr>
                        <td><strong>Status</strong></td>
                        <td>
                          <Badge bg="success">Aktif</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Card.Body>
              </Card>

              <Card className="mb-4">
                <Card.Body>
                  <h5>📊 Statistik Belajar</h5>
                  <Row className="text-center">
                    <Col md={4}>
                      <div className="border rounded p-3">
                        <h4 className="text-primary">5</h4>
                        <small>Artikel Dibaca</small>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="border rounded p-3">
                        <h4 className="text-success">3</h4>
                        <small>Kuis Diselesaikan</small>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="border rounded p-3">
                        <h4 className="text-warning">85%</h4>
                        <small>Rata-rata Nilai</small>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <div className="text-center">
                <Button variant="outline-primary" className="me-2" disabled>
                  ✏️ Edit Profil
                </Button>
                <Button variant="outline-danger" onClick={handleLogout}>
                  🚪 Logout
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;