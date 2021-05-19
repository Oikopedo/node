const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^https?:\/\/(www\.)?(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.[A-Za-z]{2,6}((\/|\?)[\w-.~:/?#[\]@!$&'()*+,;=]*)?$/.test(v),
      message: (props) => `${props.value} is not a valid link`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
// validator: (v) => /^https?:\/\/(www\.)?(?!-)[A-Za-z0-9-]{1,63}
// (?<!-)\.[A-Za-z]{2,6}((\/|\?)[\w-.~:/?#[\]@!\$&'\(\)\*\+,;=]*)?$/.test(v),
