//
//  SecureStore.swift
//  dotp_client
//
//  Created by Mark Percival on 3/15/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

import Foundation
import Locksmith

@objc(SecureStore)
class SecureStore: NSObject {
  
  @objc func loadKey(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
    let dictionary = Locksmith.loadDataForUserAccount("dAuth")
    if (dictionary == nil) {
      let bytesCount = 32
      var randomBytes = [UInt8](count: bytesCount, repeatedValue: 0) // array to hold randoms bytes
      let randomArray:NSMutableArray = NSMutableArray()
      SecRandomCopyBytes(kSecRandomDefault, bytesCount, &randomBytes)
      for i in randomBytes {
        randomArray.addObject(Int(i))
      }
      do {
        try Locksmith.updateData(["encryptionKey": randomArray], forUserAccount: "dAuth")
      } catch {
      }
      resolve(randomArray)
    } else {
      resolve(dictionary!["encryptionKey"])
    }
  }
  
}