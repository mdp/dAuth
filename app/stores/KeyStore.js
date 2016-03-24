var React = require('react-native');
let dotpCrypt = require('dotp-crypt')
let Buffer = require('buffer').Buffer
let Realm = require('realm') // Need to use the latest to get encryption
let nacl = dotpCrypt.utils.nacl
let logger = require('../lib/logger')

let DataStoreKey =  null

// Takes in the secretKey and the publicKey and returns an encrypted
// version to store in the realm datebase. The encryption key is handled by
// the OS secret store (ios Keychain)
function encryptKey(secretKey, publicKey) {
  if (!DataStoreKey){
    throw('Must initialize with the master encryption key')
  }
  let nonce = publicKey.subarray(0, nacl.secretbox.nonceLength)
  return nacl.secretbox(secretKey, nonce, DataStoreKey)
}

function decryptKey(box, publicKey) {
  if (!DataStoreKey){
    throw('Must initialize with the master encryption key')
  }
  let nonce = publicKey.subarray(0, nacl.secretbox.nonceLength)
  return nacl.secretbox.open(box, nonce, DataStoreKey)
}

class Key {

  getPublicID() {
    return this.publicID
  }

  getSecretKey() {
    return decryptKey(new Uint8Array(this.secretKeyCrypted), this.getPublicKey())
  }

  getPublicKey() {
    return dotpCrypt.getPublicKeyFromPublicID(this.publicID)
  }

  getKeyPair() {
    let keyPair = dotpCrypt.utils.nacl.box.keyPair.fromSecretKey(this.getSecretKey())
    return keyPair
  }

  pretty() {
    return this.name || this.getPublicID().substr(0,12)
  }

  decrypt(challenge){
    let keyPair = this.getKeyPair()
    try {
      var decoded = dotpCrypt.decryptChallenge(challenge, keyPair)
      if (!decoded) { return false }
      return {
        key: this,
        otp: decoded.otp,
        challengerID: decoded.id,
      }
    } catch (e) {
      logger.warn('Failed to decrypt', e)
      return false
    }
  }

  update(props) {
    props.publicID = this.publicID
    realm.write(() => {
      realm.create('Key', props, true);
    });
  }

  destroy() {
    realm.write(() => {
      realm.delete(this);
    });
  }
}

Key.schema = {
  name: 'Key',
  primaryKey: 'publicID',
  properties: {
    publicID:  'string',
    secretKeyCrypted: 'data',
    name: 'string',
    createdAt: 'date',
  }
};

exports.Key = Key

let realm;
exports.setupDatastore = async function() {
  let encryptionKey = new Uint8Array(await React.NativeModules.SecureStore.loadKey())
  DataStoreKey = encryptionKey
  realm = exports.realm = new Realm({schema: [Key]});
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
  var key = realm.objects('Key').filtered('publicID = ' + publicID)
  realm.delete(key)
}

exports.create = function(seed, name) {
  try {
    seed = seed.replace(' ','').toUpperCase()
    let keyPair = dotpCrypt.deriveKeyPair(seed)
    let secretKeyCrypted = encryptKey(keyPair.secretKey, keyPair.publicKey)
    let key = null
    realm.write(() => {
      key = realm.create('Key', {
        publicID: dotpCrypt.getPublicID(keyPair.publicKey),
        name: name,
        secretKeyCrypted: secretKeyCrypted,
        createdAt: new Date(),
      })
    })
    return key
  } catch (e) {
    logger.warn(e)
  }
}

exports.get = function(publicID) {
  return realm.objects('Key').filtered('publicID = ' + publicID)
}

exports.getAll = function() {
  return realm.objects('Key')
}
