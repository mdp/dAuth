var React = require('react-native');
var dotpNacl = require('../lib/dotp_crypt');
var {
  AsyncStorage,
} = React;


let _data = {};

class KeyPair {
  constructor(pub, priv){
    this.publicKey = pub
    this.privateKey = priv
  }

  hash() {
    return this.publicKey
  }

  pretty() {
    return this.publicKey.substr(0,8)
  }

  decrypt(challenge){
    try {
      return dotpNacl.decrypt(challenge, this.privateKey)
    } catch (e) {
      console.log('Failed to decrypt', e)
      return false
    }
  }
}

exports.deleteAll = async function() {
  let keys = await AsyncStorage.getAllKeys();
  return await AsyncStorage.multiRemove(keys)
}

exports.create = async function(seed) {
  let privateKey = dotpNacl.derivePrivateKey(seed)
  let publicKey = dotpNacl.createPublicKey(privateKey)
  console.log(privateKey, publicKey)
  await AsyncStorage.setItem(publicKey, privateKey)
}

// Returns all the keys we know about
exports.getAll = async function() {
  let keys = await AsyncStorage.getAllKeys();
  let data = []
  for (let key of keys) {
    let privateKey = await AsyncStorage.getItem(key)
    data.push(new KeyPair(key, privateKey))
  }
  return data
}


