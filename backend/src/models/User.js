const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/, 'Invalid email']
    },
    password: {
      type: String,
      minlength: 6,
      select: false
    },
    passwordHash: {
      type: String
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    role: {
      type: String,
      enum: Object.values(ROLES || { PUBLIC: 'public', ARTIST: 'artist', INSTITUTION: 'institution', ADMIN: 'admin' }),
      default: 'public',
      index: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'pending'],
      default: 'active'
    },
    accountStatus: {
      type: String,
      enum: ['pending', 'active', 'suspended'],
      default: 'active'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    avatar: {
      type: mongoose.Schema.Types.Mixed,
      default: ''
    },
    preferredLanguage: {
      type: String,
      default: 'en'
    }
  },
  {
    timestamps: true
  }
);

// Synchronize passwordHash / password and status / isActive
userSchema.pre('save', function (next) {
  if (this.password && !this.passwordHash) {
    this.passwordHash = this.password;
  }
  if (this.passwordHash && !this.password) {
    this.password = this.passwordHash;
  }
  if (this.status && this.status !== 'active') {
    this.isActive = false;
    this.accountStatus = this.status;
  } else if (this.isActive === false) {
    this.status = 'inactive';
    this.accountStatus = 'inactive';
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const hash = this.password || this.passwordHash;
  if (!hash) return false;
  return await bcrypt.compare(candidatePassword, hash);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
