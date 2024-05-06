const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs");
const { formatTitle } = require("./utils/format-title");
registerFont("./assets/GreatVibes-Regular.ttf", { family: "Great Vibes" });
registerFont("./assets/Poppins-Regular.ttf", { family: "Poppins" });

// Dimensions for the image
const width = 848;
const height = 600;

// Instantiate the canvas object
const canvas = createCanvas(width, height);
const context = canvas.getContext("2d");
const studentName = "Mayank Chhipa";
const instructorName = "Brad Gillespie";
const courseName = "The Complete Blockchain Development Course";
const date = new Date();
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const completionDate =
  months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
loadImage("./assets/jimp-cert-template.jpg").then((image) => {
  console.log("Drawing background Image");
  const pattern = context.createPattern(image, "no-repeat");
  context.fillStyle = pattern;
  context.fillRect(0, 0, width, height);

  //   for (let i = 0; i < height; i++) {
  //     context.font = "bold 5pt 'PT Sans'";
  //     context.textAlign = "left";
  //     context.fillText(i.toString(), 0, i);
  //   }

  //   for (let i = 0; i < width; i++) {
  //     context.font = "bold 5pt 'PT Sans'";
  //     context.textAlign = "left";
  //     context.fillText(i.toString(), i, 0);
  //   }

  context.font = "50px 'Great Vibes'";
  context.textAlign = "center";
  context.fillStyle = "#e9b72e";

  console.log("Writing Student Name");
  context.fillText(studentName, 424, 305);

  context.font = "17px 'Poppins'";
  context.textAlign = "center";
  context.fillStyle = "#000";

  console.log("Writing Successful Completion message");
  const message = `for successfully completing ${courseName} online course on ${completionDate}`;
  const lines = formatTitle(message);
  context.fillText(lines[0], 424, 360);
  if (lines[1]) {
    context.fillText(lines[1], 424, 380);
  }
  if (lines[2]) {
    context.fillText(lines[2], 424, 400);
  }

  context.font = "8px 'Comic Sans'";
  context.textAlign = "center";
  context.fillStyle = "#000";

  console.log("Writing Instructor Name");
  context.fillText("Best Regards", 424, 480);
  context.font = "20px 'Great Vibes'";
  context.fillText(instructorName, 424, 510);

  const buffer = canvas.toBuffer("image/jpeg");
  fs.writeFileSync("./image.jpeg", buffer);
  console.log("Generated Certificate!!");
});

// Write the image to file
