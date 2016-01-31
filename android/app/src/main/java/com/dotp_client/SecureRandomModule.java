package com.dotp_client;


import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableArray;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class SecureRandomModule extends ReactContextBaseJavaModule {

    public SecureRandomModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "SecureRandom";
    }

    @ReactMethod
    public void getBytes(int bytesLen, Promise promise) {
        SecureRandom sr = new SecureRandom();
        byte[] output = new byte[bytesLen];
        sr.nextBytes(output);
        WritableArray outputInts = Arguments.createArray();
        for(int i = 0; i < output.length; i++) {
            outputInts.pushInt((int)(output[i] & 0xFF));
        }
        promise.resolve(outputInts);
    }
}
