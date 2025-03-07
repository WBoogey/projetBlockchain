
import { ethers } from "ethers";

// Utilise ta phrase de récupération
const mnemonic = "trend twice spatial antenna shop theme emerge paper tackle rotate tortoise cinnamon";

// Générer un wallet à partir de la phrase de récupération
const wallet = ethers.Wallet.fromMnemonic(mnemonic);

console.log("Private Key:", wallet.privateKey);
console.log("Address:", wallet.address);