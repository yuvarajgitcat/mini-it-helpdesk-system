const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.join(
    __dirname,
    "../../uploads"
);

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
        recursive: true
    });
}

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },

    filename: (req, file, cb) => {

        const extension =
            path.extname(file.originalname);

        const uniqueName =
            `${Date.now()}-${Math.round(
                Math.random() * 1E9
            )}${extension}`;

        cb(null, uniqueName);
    }
});


const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "text/plain",
    "application/pdf"
];


const fileFilter = (req, file, cb) => {

    if (!allowedTypes.includes(file.mimetype)) {

        return cb(
            new Error(
                "Unsupported evidence file type"
            )
        );
    }

    cb(null, true);
};


const upload = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 10 * 1024 * 1024
    }

});


module.exports = upload;