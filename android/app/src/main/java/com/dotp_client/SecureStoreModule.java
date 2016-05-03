package com.dotp_client;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

public class SecureStoreModule extends ReactContextBaseJavaModule {

    public SecureStoreModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "SecureStore";
    }

    @ReactMethod
    public void loadKey(Promise promise) {
        WritableArray output = Arguments.createArray();
        for(int i = 0; i < 32; i++) {
            output.pushInt((int)(23 & 0xFF));
        }
        promise.resolve(output);
    }
}
