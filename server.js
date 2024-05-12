const express = require("express");
const { createStudentCertificate } = require("./canvas-cert");
const uploadCertificateToIpfs = require("./utils/upload-image-ipfs");
const app = express();

const studentName = "Mayank Chhipa";
const instructorName = "Brad Gillespie";
const courseName = "The Complete Blockchain Development Course";

app.get("/generate-nft", async (req, res) => {
  await createStudentCertificate(studentName, instructorName, courseName);
  const certificateFilename = "./assets/" + "student-certificate" + ".jpeg";
  const tokenUri = await uploadCertificateToIpfs(
    certificateFilename,
    studentName,
    courseName,
    instructorName
  );
  const ipfsTokenURI = "https://ipfs.io/ipfs/" + tokenUri.split("//");
  console.log("NFT Generation Completed!!");
  res.send("NFT Generated!!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
