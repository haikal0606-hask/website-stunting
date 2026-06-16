import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [usingFallback, setUsingFallback] = useState(false);

  // Sample data fallback
  const sampleArticles = [
    {
      _id: '1',
      title: 'Pentingnya Gizi Seimbang untuk Remaja',
      content: 'Stunting adalah kondisi gagal tumbuh pada anak balita akibat kekurangan gizi kronis...',
      category: 'nutrition',
      author: 'Dr. Sarah, M.Gizi',
      views: 150,
      createdAt: new Date()
    },
    {
      _id: '2',
      title: 'Aktivitas Fisik untuk Pertumbuhan Optimal',
      content: 'Aktivitas fisik yang teratur sangat penting untuk pertumbuhan remaja...',
      category: 'lifestyle',
      author: 'Dr. Ahmad, Sp.KO',
      views: 89,
      createdAt: new Date()
    },
    {
      _id: '3',
      title: 'Pola Makan Sehat untuk Generasi Bebas Stunting',
      content: 'Pola makan sehat sejak remaja dapat mencegah stunting pada generasi berikutnya...',
      category: 'nutrition',
      author: 'Nutritionist Team',
      views: 203,
      createdAt: new Date()
    },
    {
      _id: '4',
      title: 'Peran Remaja dalam Pencegahan Stunting',
      content: 'Remaja memainkan peran penting dalam memutus mata rantai stunting...',
      category: 'education',
      author: 'Tim Edukasi Stunting',
      views: 167,
      createdAt: new Date()
    }
  ];

  useEffect(() => {
    fetchArticles();
  }, [category]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError('');
      setUsingFallback(false);
      
      const params = category ? `?category=${category}` : '';
      const response = await axios.get(`http://localhost:5000/api/articles${params}`, {
        timeout: 5000 // Timeout setelah 5 detik
      });
      
      setArticles(response.data.articles || []);
    } catch (error) {
      console.log('Using fallback data due to error:', error.message);
      setError('Backend tidak tersedia. Menggunakan sample data.');
      setUsingFallback(true);
      setArticles(sampleArticles);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: '', label: 'Semua Kategori' },
    { value: 'nutrition', label: 'Gizi & Nutrisi' },
    { value: 'health', label: 'Kesehatan' },
    { value: 'lifestyle', label: 'Gaya Hidup' },
    { value: 'education', label: 'Pendidikan' }
  ];

  const getCategoryBadge = (category) => {
    const colors = {
      nutrition: 'success',
      health: 'danger',
      lifestyle: 'warning',
      education: 'info'
    };
    return colors[category] || 'secondary';
  };

  const getCategoryLabel = (category) => {
    const found = categories.find(cat => cat.value === category);
    return found ? found.label : category;
  };

  // Filter articles berdasarkan kategori untuk fallback
  const filteredArticles = category 
    ? articles.filter(article => article.category === category)
    : articles;

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Memuat artikel...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="mb-4">
        <Col>
          <h1>📚 Artikel Pencegahan Stunting</h1>
          <p className="lead">
            Kumpulan artikel edukatif tentang pencegahan stunting untuk remaja SMA di Banda Aceh dan Aceh Besar
          </p>
        </Col>
      </Row>

      {error && (
        <Alert variant={usingFallback ? 'warning' : 'danger'} className="mb-4">
          {error}
          {usingFallback && (
            <div className="mt-2">
              <small>
                Backend sedang tidak tersedia. Artikel yang ditampilkan adalah sample data.
              </small>
            </div>
          )}
        </Alert>
      )}

      <Row className="mb-4">
        <Col md={6}>
          <Form.Select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={6} className="text-end">
          <small className="text-muted">
            Menampilkan {filteredArticles.length} artikel
            {usingFallback && ' (sample data)'}
          </small>
        </Col>
      </Row>

      <Row>
        {filteredArticles.length === 0 ? (
          <Col className="text-center py-5">
            <h4>📝 Tidak ada artikel</h4>
            <p className="text-muted">
              Tidak ada artikel yang ditemukan untuk kategori "{getCategoryLabel(category)}"
            </p>
          </Col>
        ) : (
          filteredArticles.map(article => (
            <Col md={6} lg={4} key={article._id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <div className="mb-2">
                    <Badge bg={getCategoryBadge(article.category)} className="mb-2">
                      {getCategoryLabel(article.category)}
                    </Badge>
                  </div>
                  <Card.Title className="flex-grow-0" style={{minHeight: '60px'}}>
                    {article.title}
                  </Card.Title>
                  <Card.Text className="text-muted flex-grow-1">
                    {article.content.substring(0, 100)}...
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <div>
                      <small className="text-muted d-block">
                        👁️ {article.views} views
                      </small>
                      <small className="text-muted">
                        ✍️ {article.author}
                      </small>
                    </div>
                    <Button 
                      as={Link} 
                      to={`/articles/${article._id}`}
                      variant="outline-primary" 
                      size="sm"
                    >
                      Baca →
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Info tentang backend status */}
      <Row className="mt-4">
        <Col>
          <Alert variant="info" className="text-center">
            <small>
              <strong>Status Backend:</strong>{' '}
              {usingFallback ? '❌ Tidak terhubung' : '✅ Terhubung'} | 
              <strong> Data:</strong>{' '}
              {usingFallback ? '📋 Sample Data' : '🗄️ Database'}
            </small>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default Articles;