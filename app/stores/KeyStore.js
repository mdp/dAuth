let dotpCrypt = require('dotp-crypt')
let AsyncStorage = require('react-native').AsyncStorage
let Buffer = require('buffer').Buffer

class KeyPair {
  constructor(data){
    this.data = data
  }

  getPublicID() {
    if (this.data.publicID) {
      return this.data.publicID
    }
    let keyPair = this.getKeyPair()
    this.data.publicID = dotpCrypt.getPublicID(keyPair.publicKey)
    return this.data.publicID
  }

  getKeyPair() {
    if (this.data.keyPair) {
      return this.data.keyPair
    }
    let keyPair = dotpCrypt.utils.nacl.box.keyPair.fromSecretKey(this.data.secretKey)
    this.data.keyPair = keyPair
    return this.data.keyPair
  }

  get(key) {
    return this.data[key]
  }

  set(key, val) {
    return this.data[key] = val
  }

  pretty() {
    return this.data.name || this.getPublicID().substr(0,12)
  }

  async destroy() {
    return await AsyncStorage.removeItem(this.getPublicID())
  }

  async save() {
    return await AsyncStorage.setItem(this.getPublicID(), this.serialize())
  }

  serialize() {
    let data = {
      secretKey: dotpCrypt.utils.Base58.encode(this.data.secretKey),
      name: this.data.name,
      createdAt: this.data.createdAt || Date.now(),
    }
    return JSON.stringify(data)
  }

  decrypt(challenge){
    let keyPair = this.getKeyPair()
    try {
      decoded = dotpCrypt.decryptChallenge(challenge, keyPair)
      if (!decoded) { return false }
      return {
        key: this,
        otp: decoded.otp,
        challengerID: decoded.id,
      }
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
    var decoded = solvingKey.decrypt(challenge)
    if (decoded) {
      return decoded
    }
  }
  return false
}

function deserialize(str) {
  let data = JSON.parse(str)
  let secretKey = new Uint8Array(dotpCrypt.utils.Base58.decode(data.secretKey))
  return {
    secretKey: secretKey,
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
  try {
    seed = seed.replace(' ','').toUpperCase()
    let keyPair
      keyPair = dotpCrypt.deriveKeyPair(seed)
    let key = new KeyPair({
      secretKey: keyPair.secretKey,
      name: name,
      createdAt: Date.now(),
    })
    return await key.save()
  } catch (e) {
    console.log(e)
  }
}

exports.get = async function(publicID) {
  let item = await AsyncStorage.getItem(publicID)
  return new KeyPair(deserialize(item))
}

exports.getAll = async function() {
  let keyIds = null
  keyIds = await AsyncStorage.getAllKeys()
  let keys = []
  for ( let i = 0; i < keyIds.length; i++ ) {
    keys.push(await exports.get(keyIds[i]))
  }
  return keys
}

