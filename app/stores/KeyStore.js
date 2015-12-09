let React = require('react-native')
let dotpCrypt = require('dotp-crypt/index.js')
let Buffer = require('buffer').Buffer
window.Buffer = Buffer

let {
  AsyncStorage,
} = React;

let _data = {};

class KeyPair {
  constructor(keyPair){
    this.keyPair = keyPair
  }

  hash() {
    return this.keyPair.publicID
  }

  pretty() {
    return this.keyPair.publicID.substr(0,12)
  }

  decrypt(challenge){
    try {
      return new Buffer(dotpCrypt.decryptChallenge(challenge, this.keyPair.secretKey)).toString()
    } catch (e) {
      console.log('Failed to decrypt', e)
      return false
    }
  }
}

function serializeSecretKey(secretKey) {
  return dotpCrypt.utils.Base58.encode(secretKey)
}

function deserializeToKeyPair(str) {
  let secretKey = new Uint8Array(dotpCrypt.utils.Base58.decode(str))
  let keyPair = dotpCrypt.nacl.box.keyPair.fromSecretKey(new Uint8Array(secretKey))
  let publicID = dotpCrypt.getPublicID(keyPair.publicKey)
  return {
    secretKey: keyPair.secretKey,
    publicKey: keyPair.publicKey,
    publicID: publicID,
  }
}

exports.deleteAll = async function() {
  let keys = await AsyncStorage.getAllKeys();
  return await AsyncStorage.multiRemove(keys)
}

exports.create = async function(passphrase, salt) {
  let keyPair
  let publicID
  try {
    keyPair = await dotpCrypt.getKeyPair(passphrase, salt)
    publicID = dotpCrypt.getPublicID(keyPair.publicKey)
    dotpCrypt.getPublicKeyFromPublicID(publicID)
  } catch (e) {
    console.log(e)
  }
  await AsyncStorage.setItem(publicID, serializeSecretKey(keyPair.secretKey))
}

// Returns all the keys we know about
exports.getAll = async function(filter) {
  let keys = await AsyncStorage.getAllKeys();
  console.log(keys)
  let data = []
  for (let key of keys) {
    let keyPair = deserializeToKeyPair(await AsyncStorage.getItem(key))
    if (filter && keyPair.publicKey[0] === filter) {
      data.push(new KeyPair(keyPair))
    } else {
      data.push(new KeyPair(keyPair))
    }
  }
  return data
}

exports.getRandomPhrase = function(n) {
  // TODO: Fix random func with crypto secure rand from os
  return dotpCrypt.utils.Phrases.get(n, function(arr){arr.set([Math.floor(Math.random()*4294967296)])})
}


