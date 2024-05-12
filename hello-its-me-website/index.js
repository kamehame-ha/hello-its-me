const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser');
const cors = require('cors')
const fs = require('fs');
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken')
const { v4: id } = require('uuid')

// MongoDB
const mongoose = require('mongoose')
const User = require('./models/user')

// Express app definition & .env file hook
const app = express();
require('dotenv').config()

// Connect database
mongoose.connect(process.env.MONGOOSE_URL).then(() => {
    console.log("Database connected!")
}).catch((e) => {
    console.log(e)
})

app.use(express.static(path.join(__dirname, "./public/")))
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/upload/picture', fileUpload({
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB file size limit
}));
app.use('/api/upload/avatar', fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB file size limit
}));

// Auth server middleware
const session = require('./middleware/session')
const verifyToken = require('./middleware/jwt');
const user = require('./models/user');
const { domainToUnicode } = require('url');

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./html/index.html"))
})

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "./html/login.html"))
})

app.get("/user/:id", async (req, res) => {
    const id = req.params.id
    let user = await User.findOne({ username: id })
    
    if(!mongoose.isValidObjectId(id) && !user) {
        return res.status(404).sendFile(path.join(__dirname, "./html/404.html"))
    }

    user =  await User.findOne({ username: id }) ?? await User.findOne({ _id: id })

    if(!user) {
        return res.status(404).sendFile(path.join(__dirname, "./html/404.html"))
    }

    res.sendFile(path.join(__dirname, "./html/user.html"))
})

app.get("/user/:id/edit", session, async (req, res) => {
    const id = req.params.id

    jwt.verify(req.cookies.token, process.env.SECRET, { algorithms: ["HS256"] }, async (err, decode) => {
        const user = await User.findOne({ username: id }) ?? await User.findOne({ _id: id })

        if(err || `${user._id}` !== decode.id) {
            return res.redirect("/")
        }

        res.sendFile(path.join(__dirname, "./html/edit.html"))
    });
})

app.get("/user/:id/account", session, async (req, res) => {
    const id = req.params.id

    jwt.verify(req.cookies.token, process.env.SECRET, { algorithms: ["HS256"] }, async (err, decode) => {
        const user = await User.findOne({ username: id }) ?? await User.findOne({ _id: id })

        if(err || `${user._id}` !== decode.id) {
            return res.redirect("/")
        }

        res.sendFile(path.join(__dirname, "./html/account.html"))
    });
})

app.get("/api/icons/:query", verifyToken, (req, res) => {
    const query = req.params.query

    const iconSearch = fs.readdirSync(path.join(__dirname, "/public/img/icons/social")).filter(x => x.includes(query.toLowerCase()))

    res.send(iconSearch)
})

app.post('/api/upload/avatar', verifyToken, async (req, res) => {
    if (!req.files) {
        return res.status(400).json({ message: 'No avatar file uploaded' });
    }

    const avatarFile = req.files.file;

    if (!avatarFile.mimetype.startsWith('image')) {
        return res.status(400).json({ message: 'Please upload an image file' });
    }

    const token = req.headers.authorization.split(' ')[1]; // Assuming token is passed in the header
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const userId = decodedToken.id;
    const data = await user.findOne({ _id: userId })

    const uploadDir = path.join(__dirname, `public/img/user/${userId}`);

    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Delete previous avatar if exists
    if(data.avatarUrl) {
        const prevAvatar = fs.readdirSync(uploadDir).find(x => x.includes(data.avatarUrl.replace('https://', '').split('/')[4]) ?? null)
        fs.unlinkSync(path.join(__dirname, `public/img/user/${userId}/${prevAvatar}`))
    }

    const newFileName = `${id()}${path.extname(avatarFile.name)}`

    avatarFile.mv(path.join(uploadDir, newFileName), (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error uploading avatar file' });
        }

        res.status(200).json({ url: `https://its-me.kame.pro/img/user/${userId}/${newFileName}`, message: 'File uploaded successfully!' });
    });
})

app.post('/api/upload/picture', verifyToken, async (req, res) => {
    if (!req.files) {
        return res.status(400).json({ message: 'No picture file uploaded' });
    }

    const pictureFile = req.files.file;

    if (!pictureFile.mimetype.startsWith('image')) {
        return res.status(400).json({ message: 'Please upload an image file' });
    }

    const token = req.headers.authorization.split(' ')[1]; // Assuming token is passed in the header
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const userId = decodedToken.id;
    const data = await user.findOne({ _id: userId })

    const uploadDir = path.join(__dirname, `public/img/user/${userId}`);
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Delete previous picture if exists
    if(data.pictureUrl) {
        const prevPicture = fs.readdirSync(uploadDir).find(x => x.includes(data.pictureUrl.replace('https://', '').split('/')[4]))
        fs.unlinkSync(path.join(__dirname, `public/img/user/${userId}/${prevPicture}`))
    }

    const newFileName = `${id()}${path.extname(pictureFile.name)}`

    pictureFile.mv(path.join(uploadDir, newFileName), (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error uploading picture file' });
        }

        res.status(200).json({ url: `https://its-me.kame.pro/img/user/${userId}/${newFileName}`, message: 'File uploaded successfully!' });
    });
})

app.listen(process.env.PORT || 3000, () => {
    console.log("App is running live!")
})