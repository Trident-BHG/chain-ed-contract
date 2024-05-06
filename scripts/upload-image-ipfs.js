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

async function main() {
  console.log("Uploading Image to IPFS...");
  const readableStreamForFile = fs.createReadStream(
    path.resolve("./assets/test-cert.png")
  );
  const imageoptions = {
    pinataMetadata: {
      name: "test-cert.png",
    },
  };
  const imageUploadResponse = await pinata.pinFileToIPFS(
    readableStreamForFile,
    imageoptions
  );
  console.log("Successfully Uploaded Image to IPFS");
  console.log("Uploading metadata to IPFS...");
  let imageMetadata = { ...metadataTemplate };
  imageMetadata.name = "Test Certificate";
  imageMetadata.description = "Using test certificate image";
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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
