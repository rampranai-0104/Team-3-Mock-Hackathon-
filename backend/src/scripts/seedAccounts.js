const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Artist = require('../models/Artist');
const Institution = require('../models/Institution');
const { ROLES } = require('../constants');

const DEMO_PASSWORD = 'Tvarita@2026';

const seedAccounts = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tvarita';
    console.log('Connecting to MongoDB at:', mongoUri ? mongoUri.replace(/\/\/.*@/, '//<credentials>@') : 'unset');
    await mongoose.connect(mongoUri);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, salt);

    const accounts = [
      {
        name: 'Platform Admin',
        email: 'admin@tvarita.org',
        role: ROLES.ADMIN || 'admin',
        phone: '+91 99999 00001',
      },
      {
        name: 'Master Jivya Soma',
        email: 'artist@tvarita.org',
        role: ROLES.ARTIST || 'artist',
        phone: '+91 99999 00002',
      },
      {
        name: 'The Heritage School & Global Academy',
        email: 'institution@tvarita.org',
        role: ROLES.INSTITUTION || 'institution',
        phone: '+91 99999 00003',
      },
      {
        name: 'Radhika Sharma (Patron)',
        email: 'patron@tvarita.org',
        role: ROLES.PUBLIC || 'public',
        phone: '+91 99999 00004',
      },
    ];

    for (const acc of accounts) {
      let user = await User.findOne({ email: acc.email });
      if (user) {
        user.name = acc.name;
        user.password = passwordHash;
        user.passwordHash = passwordHash;
        user.role = acc.role;
        user.phone = acc.phone;
        user.status = 'active';
        user.isActive = true;
        user.emailVerified = true;
        await user.save();
        console.log(`✓ Updated existing account: ${acc.email} (${acc.role})`);
      } else {
        user = await User.create({
          name: acc.name,
          email: acc.email,
          password: passwordHash,
          passwordHash: passwordHash,
          role: acc.role,
          phone: acc.phone,
          status: 'active',
          isActive: true,
          emailVerified: true,
        });
        console.log(`✓ Created new account: ${acc.email} (${acc.role})`);
      }

      // If Artist, ensure Artist profile exists
      if (acc.role === (ROLES.ARTIST || 'artist')) {
        let artist = await Artist.findOne({ userId: user._id });
        if (!artist) {
          artist = await Artist.create({
            userId: user._id,
            displayName: acc.name,
            bio: 'Master practitioner and custodian of sacred indigenous tribal folk arts, dedicated to cultural preservation.',
            location: {
              city: 'Palghar',
              state: 'Maharashtra',
              country: 'India'
            },
            languages: ['Hindi', 'Marathi', 'English'],
            experience: 25,
            verificationStatus: 'approved',
            availability: true
          });
          console.log(`  ↳ Created Artist profile for: ${acc.name}`);
        } else {
          artist.displayName = acc.name;
          artist.verificationStatus = 'approved';
          artist.availability = true;
          await artist.save();
          console.log(`  ↳ Updated Artist profile for: ${acc.name}`);
        }
      }

      // If Institution, ensure Institution profile exists
      if (acc.role === (ROLES.INSTITUTION || 'institution')) {
        let inst = await Institution.findOne({ userId: user._id });
        if (!inst) {
          inst = await Institution.create({
            userId: user._id,
            organizationName: acc.name,
            type: 'school',
            contactPerson: {
              name: 'Dr. Anand Verma',
              email: acc.email,
              phone: acc.phone,
              designation: 'Head of Cultural Affairs'
            },
            address: {
              street: '42 Knowledge Corridor',
              city: 'Bengaluru',
              state: 'Karnataka',
              pincode: '560001',
              country: 'India'
            },
            verificationStatus: 'verified'
          });
          console.log(`  ↳ Created Institution profile for: ${acc.name}`);
        } else {
          inst.organizationName = acc.name;
          inst.verificationStatus = 'verified';
          await inst.save();
          console.log(`  ↳ Updated Institution profile for: ${acc.name}`);
        }
      }
    }

    console.log('\n==============================================');
    console.log('All 4 Demo Accounts Seeded Successfully!');
    console.log('Default Password for all: ' + DEMO_PASSWORD);
    console.log('==============================================');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding accounts:', err);
    process.exit(1);
  }
};

seedAccounts();
