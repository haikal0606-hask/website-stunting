import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container className="my-5">
      {/* Hero Section */}
      <Row className="text-center mb-5 py-5 bg-light rounded">
        <Col>
          <h1 className="display-4 text-primary mb-3">
            Cegah Stunting, Wujudkan Generasi Sehat Aceh
          </h1>
          <p className="lead mb-4">
            Platform edukasi pencegahan stunting khusus untuk remaja SMA 
            di Kota Banda Aceh dan Kabupaten Aceh Besar
          </p>
          <div>
            <Button as={Link} to="/articles" variant="primary" size="lg" className="me-3">
              📚 Baca Artikel
            </Button>
            <Button as={Link} to="/quiz" variant="outline-primary" size="lg">
              ❓ Mulai Kuis
            </Button>
          </div>
        </Col>
      </Row>

      {/* Features Section */}
      <Row className="mb-5">
        <Col className="text-center mb-4">
          <h2>Mengapa Remaja Perlu Tahu Tentang Stunting?</h2>
          <p className="text-muted">
            Masa remaja adalah persiapan penting untuk menjadi calon orang tua yang sehat
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center border-0 shadow-sm">
            <Card.Body>
              <div className="feature-icon mb-3">
                <span style={{fontSize: '3rem'}}>🍎</span>
              </div>
              <Card.Title>Edukasi Gizi</Card.Title>
              <Card.Text>
                Pelajari pentingnya gizi seimbang untuk remaja dan dampaknya 
                terhadap generasi mendatang
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center border-0 shadow-sm">
            <Card.Body>
              <div className="feature-icon mb-3">
                <span style={{fontSize: '3rem'}}>💪</span>
              </div>
              <Card.Title>Gaya Hidup Sehat</Card.Title>
              <Card.Text>
                Tips pola hidup sehat, aktivitas fisik, dan kebiasaan baik 
                untuk mencegah stunting
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center border-0 shadow-sm">
            <Card.Body>
              <div className="feature-icon mb-3">
                <span style={{fontSize: '3rem'}}>👨‍👩‍👧‍👦</span>
              </div>
              <Card.Title>Peran Remaja</Card.Title>
              <Card.Text>
                Pahami peran penting remaja dalam memutus mata rantai stunting 
                di Aceh
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Statistics Section */}
      <Row className="bg-primary text-white py-4 rounded mb-5">
        <Col className="text-center">
          <h3 className="mb-4">Fakta Stunting di Indonesia</h3>
          <Row>
            <Col md={3}>
              <h2 className="display-6">24.4%</h2>
              <p>Prevalensi Stunting (2021)</p>
            </Col>
            <Col md={3}>
              <h2 className="display-6">14%</h2>
              <p>Target 2024</p>
            </Col>
            <Col md={3}>
              <h2 className="display-6">1000</h2>
              <p>Hari Pertama Kehidupan</p>
            </Col>
            <Col md={3}>
              <h2 className="display-6">70%</h2>
              <p>Peran Remaja dalam Pencegahan</p>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Call to Action */}
      <Row className="text-center">
        <Col>
          <h3 className="mb-3">Siap Menjadi Agen Perubahan?</h3>
          <p className="text-muted mb-4">
            Bergabunglah dengan ribuan remaja Aceh lainnya dalam kampanye pencegahan stunting
          </p>
          <Button as={Link} to="/register" variant="success" size="lg">
            📝 Daftar Sekarang
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;