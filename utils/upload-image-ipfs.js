const pinataSDK = require("@pinata/sdk");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const pinataJWTKey = process.env.PINATA_JWT_KEY;
const pinata = new pinataSDK({ pinataJWTKey: pinataJWTKey });
const metadataTemplate = {
  name: "",
  description: "",
  image: "",
};

module.exports = async function uploadCertificateToIpfs(
  certificateFilename,
  studentName,
  courseName,
  instructorName
) {
  console.log("Uploading Image to IPFS...");
  const readableStreamForFile = fs.createReadStream(
    path.resolve(certificateFilename)
  );
  const imageoptions = {
    pinataMetadata: {
      name: studentName + courseName,
    },
  };
  const imageUploadResponse = await pinata.pinFileToIPFS(
    readableStreamForFile,
    imageoptions
  );
  console.log("Successfully Uploaded Image to IPFS");
  console.log("Uploading metadata to IPFS...");
  let imageMetadata = { ...metadataTemplate };
  imageMetadata.name = studentName + "certificate for" + courseName;
  imageMetadata.description = studentName + courseName + instructorName;
  imageMetadata.image = `ipfs://${imageUploadResponse.IpfsHash}`;
  const metadataOptions = {
    pinataMetadata: {
      name: imageMetadata.name,
    },
  };
  const imageMetadataUploadResponse = await pinata.pinJSONToIPFS(
    imageMetadata,
    metadataOptions
  );
  //   console.log(imageMetadataUploadResponse);

  const tokenUri = `ipfs://${imageMetadataUploadResponse.IpfsHash}`;
  console.log(tokenUri);
  console.log("Successfully uploaded image to IPFS!!");
  return tokenUri;
};
