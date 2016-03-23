//
//  SwiftBridge.m
//  dotp_client
//
//  Created by Mark Percival on 3/16/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "RCTBridgeModule.h"

// Clipboard
@interface RCT_EXTERN_MODULE(Clipboard, NSObject)

RCT_EXTERN_METHOD(copyStr:(notnull NSString)str)

@end

// SecureStore
@interface RCT_EXTERN_MODULE(SecureStore, NSObject)

RCT_EXTERN_METHOD(loadKey:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

@end

// SecureRandom
@interface RCT_EXTERN_MODULE(SecureRandom, NSObject)

RCT_EXTERN_METHOD(getBytes:(nonnull NSNumber *)length resolver:(RCTPromiseResolveBlock *)resolve  rejecter:(RCTPromiseRejectBlock *)reject)

@end