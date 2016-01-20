//
//  SecureRandom.swift
//  dotp_client
//
//  Created by Mark Percival on 1/17/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

import Foundation

@objc(SecureRandom)
class SecureRandom: NSObject {
  
  @objc func getBytes(length: NSNumber, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    let bytesCount = Int(length)
    var randomBytes = [UInt8](count: bytesCount, repeatedValue: 0) // array to hold randoms bytes
    let randomArray:NSMutableArray = NSMutableArray()
    SecRandomCopyBytes(kSecRandomDefault, bytesCount, &randomBytes)
    for i in randomBytes {
      randomArray.addObject(Int(i))
    }
    resolve(randomArray)
  }
  
}