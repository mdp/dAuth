//
//  SecureRandomBridge.m
//  dotp_client
//
//  Created by Mark Percival on 1/17/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(SecureRandom, NSObject)

RCT_EXTERN_METHOD(getBytes:(nonnull NSNumber *)length resolver:(RCTPromiseResolveBlock *)resolve  rejecter:(RCTPromiseRejectBlock *)reject)

@end
