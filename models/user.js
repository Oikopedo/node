const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: (props) => `${props.value} ссылка недействительна`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'http://example.com/pic.jpg',
    validate: {
      validator: (v) => /^https?:\/\/(www\.)?(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.[A-Za-z]{2,6}((\/|\?)[\w-.~:/?#[\]@!$&'()*+,;=]*)?$/.test(v),
      message: (props) => `${props.value} ссылка недействительна`,
    },
  },
});

module.exports = mongoose.model('user', userSchema);
