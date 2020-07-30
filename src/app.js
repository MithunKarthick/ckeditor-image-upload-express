const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { uuid } = require("uuidv4");

//setting unique ID in request
const setUniqueID = () => {
	return (req, res, next) => {
		req.uniqueID = uuid();
		next();
	};
};

//storing image files in the image path using multer
const multer = require("multer");
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./images");
	},
	filename: function (req, file, cb) {
		cb(null, `${uuid()}.${file.originalname.split(".")[1]}`); //filename = uniqueID + original extension
	},
});
const upload = multer({ storage });

const app = express();

//middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));  // should be client host url ( CORS issue )
app.use("/upload", setUniqueID());
app.use("/upload", upload.any()); // client will be sending only images

app.post("/upload", (req, res) => {
	res.json({
		uploaded: true,
		url: `http://localhost:4000/images?img=${req.files[0].filename}`,
	});
});

app.get("/images", (req, res) => {
    res.status(200);
	res.sendFile(`${__dirname}/images/${req.query.img}`);
});

app.listen(4000, () => {
	console.log("listening on port 4000");
});
