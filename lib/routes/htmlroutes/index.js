const apiRoutes = require("./routes/apiRoutes");
const htmlRoutes = require("./routes/htmlRoutes")

const path = require('path');
const router = require('express').Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

router.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

router.get('/zookeepers', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

const router = require("express").Router();
const animalRoutes = require("../apiroutes/animalRoutes");

router.use(animalRoutes);

module.exports = router;
