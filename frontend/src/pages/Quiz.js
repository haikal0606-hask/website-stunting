import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert, ProgressBar, Badge } from 'react-bootstrap';
import axios from 'axios';

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('http://localhost:5000/api/quiz');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setError('Gagal memuat kuis. Pastikan backend berjalan di port 5000.');
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const createSampleQuizzes = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/quiz/sample');
      await fetchQuizzes(); // Refresh quizzes
    } catch (error) {
      setError('Gagal membuat sample quizzes');
    }
  };

  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleSubmit = async () => {
    const answerArray = Object.entries(answers).map(([questionId, optionId]) => ({
      questionId,
      optionId
    }));

    try {
      const response = await axios.post('http://localhost:5000/api/quiz/submit', {
        answers: answerArray
      });
      setResults(response.data);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setError('Gagal mengirim jawaban');
    }
  };

  const resetQuiz = () => {
    setSubmitted(false);
    setResults(null);
    setAnswers({});
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

  if (submitted && results) {
    return (
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="text-center shadow">
              <Card.Body className="py-5">
                <h2 className="mb-4">🎉 Hasil Kuis Anda</h2>
                
                <div className="display-4 text-primary my-4 fw-bold">
                  {results.percentage}%
                </div>
                
                <ProgressBar 
                  now={results.percentage} 
                  variant={results.percentage >= 70 ? 'success' : results.percentage >= 50 ? 'warning' : 'danger'}
                  className="mb-4"
                  style={{height: '20px'}}
                />
                
                <p className="h5 mb-3">
                  Skor: <strong>{results.score}</strong> dari <strong>{results.total}</strong> pertanyaan
                </p>
                
                <Alert variant={results.percentage >= 70 ? 'success' : 'warning'} className="mb-4">
                  <h5>
                    {results.percentage >= 70 
                      ? '🎊 Selamat! Pemahaman Anda tentang pencegahan stunting sangat baik.'
                      : results.percentage >= 50 
                      ? '👍 Bagus! Tingkatkan lagi pemahaman Anda tentang pencegahan stunting.'
                      : '📚 Ayo belajar lebih giat! Baca artikel untuk meningkatkan pemahaman.'
                    }
                  </h5>
                </Alert>

                <div className="mt-4 text-start">
                  <h5 className="mb-3">📋 Pembahasan Jawaban:</h5>
                  {results.results.map((result, index) => (
                    <Card key={index} className="mb-3 border-0 bg-light">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-0">Pertanyaan {index + 1}</h6>
                          {result.isCorrect ? (
                            <Badge bg="success">✅ Benar</Badge>
                          ) : (
                            <Badge bg="danger">❌ Salah</Badge>
                          )}
                        </div>
                        <p className="fw-bold mb-2">{result.question}</p>
                        <p className="mb-1">
                          <strong>Jawaban Anda:</strong> {result.selectedOption}
                        </p>
                        <p className="mb-2">
                          <strong>Jawaban Benar:</strong> <span className="text-success">{result.correctOption}</span>
                        </p>
                        <p className="mb-0 text-muted">
                          <strong>Penjelasan:</strong> {result.explanation}
                        </p>
                      </Card.Body>
                    </Card>
                  ))}
                </div>

                <div className="mt-4">
                  <Button variant="primary" onClick={resetQuiz} className="me-3">
                    🔄 Coba Lagi
                  </Button>
                </div>
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
        <Col lg={8}>
          <Card className="mb-4 shadow">
            <Card.Body className="text-center py-4">
              <h1>❓ Kuis Pencegahan Stunting</h1>
              <p className="lead mb-3">
                Uji pemahaman Anda tentang pencegahan stunting
              </p>
              
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                  <div className="mt-2">
                    <Button variant="outline-danger" size="sm" onClick={createSampleQuizzes}>
                      Buat Sample Quizzes
                    </Button>
                  </div>
                </Alert>
              )}

              {quizzes.length === 0 ? (
                <div className="py-3">
                  <p className="text-muted mb-3">Belum ada kuis tersedia</p>
                  <Button variant="primary" onClick={createSampleQuizzes}>
                    Buat Sample Quizzes
                  </Button>
                </div>
              ) : (
                <>
                  <p>
                    Terdapat <strong>{quizzes.length}</strong> pertanyaan. 
                    Pilih jawaban yang paling benar.
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <Badge bg="primary">
                      📊 {Object.keys(answers).length} dari {quizzes.length} terjawab
                    </Badge>
                    <Badge bg="success">
                      ⏱️ Waktu: {quizzes.length * 2} menit
                    </Badge>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>

          {quizzes.length > 0 && (
            <>
              {quizzes.map((quiz, index) => (
                <Card key={quiz._id} className="mb-3 shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="mb-0">Pertanyaan {index + 1}</h5>
                      <Badge bg={getCategoryBadge(quiz.category)}>
                        {quiz.category}
                      </Badge>
                    </div>
                    <p className="fw-bold fs-6 mb-3">{quiz.question}</p>
                    
                    <Form>
                      {quiz.options.map((option, optIndex) => (
                        <Form.Check
                          key={option._id}
                          type="radio"
                          id={`${quiz._id}-${option._id}`}
                          name={quiz._id}
                          label={option.text}
                          checked={answers[quiz._id] === option._id}
                          onChange={() => handleAnswerSelect(quiz._id, option._id)}
                          className="mb-2 p-2 rounded hover-bg"
                          style={{
                            backgroundColor: answers[quiz._id] === option._id ? '#e3f2fd' : 'transparent',
                            transition: 'background-color 0.2s'
                          }}
                        />
                      ))}
                    </Form>
                  </Card.Body>
                </Card>
              ))}

              <div className="text-center mt-4">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length !== quizzes.length}
                  className="px-5"
                >
                  {Object.keys(answers).length === quizzes.length ? 
                    '🎯 Submit Jawaban' : 
                    `📝 Jawab ${quizzes.length - Object.keys(answers).length} Pertanyaan Lagi`
                  }
                </Button>
                <p className="text-muted mt-2">
                  Pastikan semua pertanyaan telah dijawab sebelum submit
                </p>
              </div>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Quiz;