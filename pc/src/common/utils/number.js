import { CODE_LEN } from "@/common/config/crypto";
const generateRandomNumber = (min, max) => {
  if (typeof min !== "number" || typeof max !== "number" || min > max)
    throw new Error("arguments invalid");
  return parseInt(Math.random() * (max - min + 1) + min, 10);
};

const generateCode = (length = CODE_LEN) => {
  if (typeof length !== "number" || length < 1) {
    throw new Error("arguments invalid");
  }
  let code = "";
  let i = 0;
  while (i < length) {
    code += generateRandomNumber(0, 9);
    i++;
  }
  return code;
};

export { generateRandomNumber, generateCode };
