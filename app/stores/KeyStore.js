let dotpCrypt = require('dotp-crypt')
let AsyncStorage = require('react-native').AsyncStorage
let Buffer = require('buffer').Buffer

class Key {

  getPublicID() {
    return dotpCrypt.getPublicID(new Uint8Array(this.publicKey))
  }

  getKeyPair() {
    let keyPair = dotpCrypt.utils.nacl.box.keyPair.fromSecretKey(this.secretKey)
    return keyPair
  }

  pretty() {
    return this.name || this.getPublicID().substr(0,12)
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

Key.schema = {
  name: 'Key',
  properties: {
    publicID:  'string',
    secretKey: 'data',
    publicKey: 'data',
    name: 'string',
    createdAt: 'date',
  }
};

let realm;
exports.setupDatastore = async function() {
  //let encryptionKeyArr = await React.NativeModules.SecureStore.getDatastoreKey();
  let encryptionKey = new Uint8Array(64)
  realm = exports.realm = new Realm({schema: [Key], encryptionKey: encryptionKey});
  return true
}

exports.decryptChallenge = function(challenge) {
  let key = null
  let result = {}
  let solvingKey = false
  let otp = false
  let keys = realm.objects('Key')
  for ( let i = 0; i < keys.length; i++ ) {
    solvingKey = keys[i]
    var decoded = solvingKey.decrypt(challenge)
    if (decoded) {
      return decoded
    }
  }
  return false
}

exports.destroy = function(publicID) {
  var key = realm.objects('Key').filtered("publicID = " + publicID)
  realm.delete(key)
}

exports.create = async function(seed, name) {
  try {
    seed = seed.replace(' ','').toUpperCase()
    let keyPair = dotpCrypt.deriveKeyPair(seed)
    realm.write(() => {
      let key = realm.create('Key', {
        secretKey: keyPair.secretKey,
        publicKey: keyPair.publicKey,
        publicID: dotpCrypt.getPublicID(keyPair.publicKey),
        name: name,
        createdAt: new Date(),
      })
      return key
    })
  } catch (e) {
    console.log(e)
  }
}

exports.get = async function(publicID) {
  return realm.objects('Key').filtered("publicID = " + publicID)
}

exports.getAll = async function() {
  return realm.objects('Key')
}
