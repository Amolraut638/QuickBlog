import multer from "multer";

const upload = multer({storage : multer.diskStorage({})})

export default upload;

//we have created upload middleware using the multer package