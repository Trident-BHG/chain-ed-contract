//max chars is the number of maximum characters we want in a line
const getMaxNextLine = (input, maxChars = 50) => {
  // Split the string into an array of words.
  const allWords = input.split(" ");
  // Find the index in the words array at which we should stop or we will exceed
  // maximum characters.
  //prev is current single response of reduce function
  // cur is current element
  //index is index of current element
  const lineIndex = allWords.reduce((prev, cur, index) => {
    //? means optional variable
    //prev.done=true means max chars have been considered for a line
    if (prev?.done) return prev;
    const endLastWord = prev?.position || 0;
    //plus 1 is for space character
    //position represents characters traversed till now for a line
    const position = endLastWord + 1 + cur.length;
    return position >= maxChars ? { done: true, index } : { position, index };
  });
  // Using the index, build a string for this line ...
  const line = allWords.slice(0, lineIndex.index).join(" ");
  // And determine what's left.
  const remainingChars = allWords.slice(lineIndex.index).join(" ");
  // Return the result.
  return { line, remainingChars };
};

exports.formatTitle = (title) => {
  let output = [];

  const firstLine = getMaxNextLine(title);
  const secondLine = getMaxNextLine(firstLine.remainingChars);
  const thirdLine = getMaxNextLine(secondLine.remainingChars);

  output = [firstLine.line];
  let fmSecondLine = secondLine.line;

  if (secondLine.remainingChars.length > 0) fmSecondLine;
  output.push(fmSecondLine);

  let fmThirdLine = thirdLine.line;
  if (thirdLine.remainingChars.length > 0) fmThirdLine;

  output.push(fmThirdLine);

  return output;
};
