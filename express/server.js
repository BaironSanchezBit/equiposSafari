'use strict'
const cors = require('cors');
const authRoutes = require('./auth/auth.routers');
const catalogoRoutes = require('./catalogos/catalogo.routers');
const express = require('express');
const conectarDB = require('./config/db');
const path = require('path');
const fs = require('fs');
//init DB
conectarDB();

const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();
const router = express.Router();

const bodyParser = require('body-parser');
const bodyParserJSON = bodyParser.json();
const bodyParserURLEncoded = bodyParser.urlencoded({ extended: true });

app.use(bodyParserJSON);
app.use(bodyParserURLEncoded);
app.use(express.static('public'));

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname + '.png')
  }
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

app.use('/api', router);
authRoutes(router);
catalogoRoutes(router, upload);

app.listen(4000, () => {
    console.log('El servidor está arriba')
});
