import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`http://localhost:5000/api/articles/${id}`);
      setArticle(response.data);
    } catch (error) {
      console.error('Error fetching article:', error);
      setError('Artikel tidak ditemukan atau terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadge = (category) => {
    const colors = {
      nutrition: 'success',
      health: 'danger',
      lifestyle: 'warning',
      education: 'info'
    };
    return colors[category] || 'secondary';
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error || !article) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          <h4>❌ Artikel Tidak Ditemukan</h4>
          <p>{error || 'Artikel yang Anda cari tidak tersedia.'}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <article>
            <div className="mb-3">
              <Badge bg={getCategoryBadge(article.category)} className="mb-2">
                {article.category}
              </Badge>
            </div>
            
            <h1 className="mb-3">{article.title}</h1>
            
            <div className="text-muted mb-4">
              <small>
                ✍️ Penulis: <strong>{article.author}</strong> | 
                📊 Dilihat: <strong>{article.views}</strong> kali |
                📅 Kategori: <strong className="text-capitalize">{article.category}</strong>
              </small>
            </div>

            <Card className="mb-4 border-0 shadow-sm">
              <Card.Body>
                <div className="article-content">
                  {article.content.split('\n').map((paragraph, index) => {
                    if (paragraph.startsWith('## ')) {
                      return <h4 key={index} className="mt-4 mb-3">{paragraph.replace('## ', '')}</h4>;
                    }
                    if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
                      return (
                        <div key={index} className="d-flex align-items-start mb-2">
                          <span className="me-2">•</span>
                          <span>{paragraph.replace(/^[1-9]\.\s+|- /, '')}</span>
                        </div>
                      );
                    }
                    if (paragraph.trim() === '') {
                      return <br key={index} />;
                    }
                    return <p key={index} className="mb-3">{paragraph}</p>;
                  })}
                </div>
              </Card.Body>
            </Card>

            <Card className="bg-light">
              <Card.Body>
                <Card.Title>💡 Tentang Topik Ini</Card.Title>
                <Card.Text>
                  Artikel ini merupakan bagian dari kampanye pencegahan stunting 
                  untuk remaja SMA di Banda Aceh dan Aceh Besar. 
                  Pengetahuan tentang gizi dan kesehatan sejak dini 
                  sangat penting untuk menciptakan generasi yang sehat dan bebas stunting.
                </Card.Text>
              </Card.Body>
            </Card>
          </article>
        </Col>
      </Row>
    </Container>
  );
};

export default ArticleDetail;