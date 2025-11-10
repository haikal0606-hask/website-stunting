import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={6}>
            <h5>🩺 Stunting Prevention</h5>
            <p>
              Platform edukasi pencegahan stunting untuk remaja SMA 
              di Banda Aceh dan Aceh Besar. Wujudkan generasi sehat 
              dan bebas stunting!
            </p>
          </Col>
          <Col md={3}>
            <h6>Menu Cepat</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light text-decoration-none">Home</a></li>
              <li><a href="/articles" className="text-light text-decoration-none">Artikel</a></li>
              <li><a href="/quiz" className="text-light text-decoration-none">Kuis</a></li>
            </ul>
          </Col>
          <Col md={3}>
            <h6>Kontak</h6>
            <p className="mb-1">📧 info@stuntingprevention.com</p>
            <p className="mb-1">📞 (0651) 123-4567</p>
            <p>📍 Banda Aceh & Aceh Besar</p>
          </Col>
        </Row>
        <hr className="my-4" />
        <Row>
          <Col className="text-center">
            <p className="mb-0">
              &copy; 2024 Stunting Prevention. All rights reserved. | 
              Made with ❤️ for Aceh Teens
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;