const express = require('express');
const router = express.Router();

// Sample articles data - akan digunakan jika database belum siap
const sampleArticles = [
  {
    _id: '1',
    title: 'Pentingnya Gizi Seimbang untuk Remaja',
    content: `Stunting adalah kondisi gagal tumbuh pada anak balita akibat kekurangan gizi kronis dan infeksi berulang. 

Pencegahan stunting dimulai dari remaja. Remaja putri yang akan menjadi calon ibu perlu memahami pentingnya gizi seimbang untuk mempersiapkan kehamilan yang sehat.

## Apa yang Perlu Diperhatikan?

1. **Asupan Protein**: Penting untuk pertumbuhan dan perkembangan
2. **Zat Besi**: Mencegah anemia, terutama pada remaja putri
3. **Kalsium**: Untuk pertumbuhan tulang yang optimal
4. **Vitamin A, C, D**: Meningkatkan imunitas dan kesehatan

Dengan pola makan seimbang dan gaya hidup sehat, remaja dapat menjadi agen perubahan dalam memutus mata rantai stunting di Indonesia, khususnya di Aceh.`,
    category: 'nutrition',
    author: 'Dr. Sarah, M.Gizi',
    views: 150,
    createdAt: new Date()
  },
  {
    _id: '2',
    title: 'Aktivitas Fisik untuk Pertumbuhan Optimal',
    content: `Aktivitas fisik yang teratur sangat penting untuk pertumbuhan remaja. Olahraga membantu meningkatkan densitas tulang dan massa otot, yang penting untuk mencegah stunting.

## Jenis Aktivitas yang Disarankan:

- **Aktivitas Aerobik**: Lari, berenang, bersepeda
- **Latihan Kekuatan**: Angkat beban ringan, push-up, sit-up
- **Latihan Fleksibilitas**: Yoga, stretching

Remaja disarankan untuk beraktivitas fisik minimal 60 menit setiap hari. Aktivitas fisik tidak hanya mendukung pertumbuhan fisik tetapi juga kesehatan mental.`,
    category: 'lifestyle',
    author: 'Dr. Ahmad, Sp.KO',
    views: 89,
    createdAt: new Date()
  },
  {
    _id: '3',
    title: 'Pola Makan Sehat untuk Generasi Bebas Stunting',
    content: `Pola makan sehat sejak remaja dapat mencegah stunting pada generasi berikutnya. Remaja perlu mengonsumsi berbagai jenis makanan untuk memenuhi kebutuhan gizi.

## Prinsip Pola Makan Sehat:

1. **Variasi Makanan**: Konsumsi berbagai jenis makanan
2. **Porsi Seimbang**: Sesuaikan porsi dengan kebutuhan
3. **Waktu Makan Teratur**: Jangan melewatkan makan utama
4. **Hindari Makanan Cepat Saji**: Batasi konsumsi makanan tinggi gula dan lemak

Dengan menerapkan pola makan sehat, remaja dapat tumbuh optimal dan mencegah stunting pada generasi mendatang.`,
    category: 'nutrition',
    author: 'Nutritionist Team',
    views: 203,
    createdAt: new Date()
  },
  {
    _id: '4',
    title: 'Peran Remaja dalam Pencegahan Stunting',
    content: `Remaja memainkan peran penting dalam memutus mata rantai stunting. Meskipun stunting terjadi pada anak balita, pencegahannya dimulai sejak masa remaja.

## Mengapa Remaja Penting?

1. **Calon Orang Tua**: Remaja hari ini adalah orang tua masa depan
2. **Agen Perubahan**: Dapat menyebarkan pengetahuan ke keluarga dan teman
3. **Pola Hidup Sehat**: Kebiasaan sehat dimulai sejak remaja

Remaja di Banda Aceh dan Aceh Besar dapat menjadi pionir dalam kampanye pencegahan stunting.`,
    category: 'education',
    author: 'Tim Edukasi Stunting',
    views: 167,
    createdAt: new Date()
  }
];

// Get all articles - dengan fallback ke sample data
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    
    // Filter articles berdasarkan kategori jika ada
    let filteredArticles = sampleArticles;
    if (category && category !== '') {
      filteredArticles = sampleArticles.filter(article => 
        article.category === category
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    res.json({
      articles: paginatedArticles,
      totalPages: Math.ceil(filteredArticles.length / limit),
      currentPage: parseInt(page),
      total: filteredArticles.length
    });
  } catch (error) {
    // Fallback ke sample data jika ada error
    console.error('Error in articles route:', error);
    res.json({
      articles: sampleArticles,
      totalPages: 1,
      currentPage: 1,
      total: sampleArticles.length
    });
  }
});

// Get single article
router.get('/:id', async (req, res) => {
  try {
    const article = sampleArticles.find(a => a._id === req.params.id);
    
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    console.error('Error fetching single article:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create sample articles endpoint
router.post('/sample', async (req, res) => {
  try {
    res.json({ 
      message: 'Sample articles are ready to use',
      articles: sampleArticles 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;