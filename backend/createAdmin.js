const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const User = require('./models/userModel');

// Load env
dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Cek apakah admin sudah ada
    const adminExists = await User.findOne({ email: 'admin@stuntingcare.com' });

    if (adminExists) {
      console.log('Akun Admin sudah tersedia.');
      process.exit();
    }

    // Buat password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Bikin user admin
    const admin = await User.create({
      user_id: uuidv4(),
      nama: 'Administrator Pusat',
      email: 'admin@stuntingcare.com',
      password_hash: hashedPassword,
      asal_sekolah: 'Dinas Kesehatan B. Aceh',
      wilayah: 'Banda Aceh',
      role: 'Admin'
    });

    console.log('BERHASIL MEMBUAT AKUN ADMIN!');
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    
    process.exit();
  } catch (error) {
    console.error('Gagal:', error.message);
    process.exit(1);
  }
};

createAdmin();
