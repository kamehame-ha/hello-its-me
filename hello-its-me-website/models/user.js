var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    nickname: {
        type: String,
        default: null
    },
    status: {
        type: String,
        default: "No status"
    },
    avatarUrl: {
        type: String,
        default: null
    },
    pictureUrl: {
        type: String,
        default: null
    },
    socialAccounts: {
        type: Array,
        default: []
    },
    bio: {
        type: String,
        default: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor incididunt ut labore et dolore magna"
    },
    colorScheme: {
        type: String,
        enum: ["cyan", "green", "indigo", "pink", "red", "sky", "teal", "yellow"],
        default: ["cyan", "green", "indigo", "pink", "red", "sky", "teal", "yellow"][Math.floor(Math.random() * ["cyan", "green", "indigo", "pink", "red", "sky", "teal", "yellow"].length)]
    }
});

module.exports = mongoose.model('user', userSchema);