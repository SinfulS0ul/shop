const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('../config/keys');

aws.config.update({
  secretAccessKey: config.secretAccessKey,
  accessKeyId: config.accessKeyId,
  region: 'us-east-2'
});

const s3 = new aws.S3();
 
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'murph1ne',
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, {fieldName: 'SOME_META_DATA'});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + file.originalname)
    }
  })
});

module.exports = upload;