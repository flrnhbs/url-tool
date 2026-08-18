import { compress, decompress } from "./compress.js";
import {
  outputAlphabetASCII,
  outputAlphabetQR,
  outputAlphabetEmoji
} from "./alphabets.js";

const input = process.argv[2]?.trim();
const alphabetName = process.argv[3]?.trim() || "ascii";
let sitemode = process.argv[4]?.trim() || "lnk.flrnh.be"

if (!input) {
  console.error(`Usage: hamr <link> [ascii|qr|emoji] [lnk.flrn.be|ha.mr]`);
  process.exit(1);
}

let payload = "";
if (input.toLowerCase().startsWith("http://lnk.flrnh.be")) {
  payload = input.slice(19);
} else if (input.toLowerCase().startsWith("https://lnk.flrnh.be")) {
  payload = input.slice(20);
} else if (input.toLowerCase().startsWith("lnk.flrnh.be")) {
  payload = input.slice(12);
} else
  if (input.toLowerCase().startsWith("http://ha.mr")) {
    payload = input.slice(13);
  } else if (input.toLowerCase().startsWith("https://ha.mr")) {
    payload = input.slice(14);
  } else if (input.toLowerCase().startsWith("ha.mr")) {
    payload = input.slice(6);
  }

if (payload) {
  const isQRCode = input[0] === "/";
  payload = payload.slice(1);
  const useEmoji = Array.from(payload).some(c => !outputAlphabetASCII.includes(c));
  if (isQRCode) console.log(decompress(payload, outputAlphabetQR));
  else console.log(decompress(payload, useEmoji ? outputAlphabetEmoji : outputAlphabetASCII));
  process.exit(0);
}

let alphabet = outputAlphabetASCII;
if (alphabetName === "qr") alphabet = outputAlphabetQR;
else if (alphabetName === "emoji") alphabet = outputAlphabetEmoji;
else if (alphabetName !== "ascii") {
  if (alphabetName === "lnk.flrnh.be" || alphabetName === "ha.mr") {
    sitemode = alphabetName;
  } else {
  console.error(`Unknown alphabet "${alphabetName}".`);
  console.error("Select one of: ascii, qr, emoji");
  process.exit(2);
  }
} 

if (alphabetName === "qr") {
  if (sitemode === "lnk.flrnh.be") {
    console.log("HTTP://LNK.FLRNH.BE/" + compress(input, alphabet));
  } else if (sitemode === "ha.mr") {
    console.log("HTTP://HA.MR/" + compress(input, alphabet));
  } else {
    console.error(`Unknown site "${sitemode}".`);
    console.error("Select one of: lnk.flrnh.be, ha.mr")
    process.exit(3);
  }
} else {
  if (sitemode === "lnk.flrnh.be") {
    console.log("http://lnk.flrnh.be#" + compress(input, alphabet));
  } else if (sitemode === "ha.mr") {
    console.log("http://ha.mr#" + compress(input, alphabet));
  } else {
    console.error(`Unknown site "${sitemode}".`);
    console.error("Select one of: lnk.flrnh.be, ha.mr")
    process.exit(3);
  }
}
