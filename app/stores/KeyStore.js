let dotpCrypt = require('dotp-crypt')
let AsyncStorage = require('react-native').AsyncStorage
let Buffer = require('buffer').Buffer

let _data = {};

class KeyPair {
  constructor(data){
    this.data = data
  }

  get(key) {
    return this.data[key]
  }

  pretty() {
    return this.data.name || this.data.publicID.substr(0,12)
  }

  async destroy() {
    return await AsyncStorage.removeItem(this.data.publicID)
  }

  decrypt(challenge){
    try {
      return new Buffer(dotpCrypt.decryptChallenge(challenge, this.data.secretKey)).toString()
    } catch (e) {
      console.log('Failed to decrypt', e)
      return false
    }
  }
}

exports.decryptChallenge = async function(challenge) {
  let key = null
  let result = {}
  let solvingKey = false
  let otp = false
  let keys = await AsyncStorage.getAllKeys()
  for ( let i = 0; i < keys.length; i++ ) {
    solvingKey = await exports.get(keys[i])
    otp = solvingKey.decrypt(challenge)
    if (otp) {
      return {key: solvingKey, otp: otp}
    }
  }
  return false
}

function serialize(secretKey, name) {
  let data = {
    secretKey: dotpCrypt.utils.Base58.encode(secretKey),
    name: name,
    createdAt: Date.now(),
  }
  return JSON.stringify(data)
}

function deserialize(str) {
  let data = JSON.parse(str)
  let secretKey = new Uint8Array(dotpCrypt.utils.Base58.decode(data.secretKey))
  let keyPair = dotpCrypt.nacl.box.keyPair.fromSecretKey(new Uint8Array(secretKey))
  let publicID = dotpCrypt.getPublicID(keyPair.publicKey)
  return {
    secretKey: secretKey,
    publicKey: keyPair.publicKey,
    publicID: publicID,
    name: data.name,
    createdAt: data.createdAt,
  }
}

exports.destroyAll = function() {
  return AsyncStorage.clear()
}

exports.destroy = function(publicId) {
  return AsyncStorage.removeItem(publicId)
}

exports.create = async function(seed, name) {
  seed = seed.replace(' ','').toUpperCase()
  console.log(seed, name)
  let keyPair
  let publicID
  try {
    keyPair = dotpCrypt.deriveKeyPair(seed)
    publicID = dotpCrypt.getPublicID(keyPair.publicKey)
  } catch (e) {
    console.log(e)
  }
  console.log(seed, name)
  console.log(serialize(keyPair.secretKey, name))
  return await AsyncStorage.setItem(publicID, serialize(keyPair.secretKey, name))
}

exports.get = async function(publicID) {
  let item = await AsyncStorage.getItem(publicID)
  console.log('item', item)
  console.log('publicId', publicID)
  return new KeyPair(deserialize(item))
}

exports.getAll = async function() {
  console.log('getALL')
  let keyIds = null
  keyIds = await AsyncStorage.getAllKeys()
  let keys = []
  console.log(keyIds)
  for ( let i = 0; i < keyIds.length; i++ ) {
    keys.push(await exports.get(keyIds[i]))
  }
  return keys
}

