const aws = require('aws-sdk');
const { v4: uuid } = require('uuid');
const { extname } = require('path');

// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  params: {
    ACL: 'public-read',
    Bucket: 'your-bucket-name',
  },
});

async function upload(file, folder){

  if(!file) return null;

  const { createReadStream, filename, mimetype, encoding } = await file;

  try {
    const { Location } = await s3.upload({ 
      Body: createReadStream(),               
      Key: `${folder}${uuid()}${extname(filename)}`,  
      ContentType: mimetype                   
    }).promise();         
        
    return {
      filename,
      mimetype,
      encoding,
      uri: Location, 
    }; 
  } catch(e) {
    return { error: { msg: 'Error uploading file' }};
  }
}

module.exports = {
  upload,
};