package com.dotp_client;


import android.app.Activity;

import com.facebook.react.bridge.ReactContextBaseJavaModule;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.zxing.integration.android.IntentIntegrator;

public class QRCodeScanModule extends ReactContextBaseJavaModule {

    Activity mActivity;

    public QRCodeScanModule(ReactApplicationContext reactContext, Activity activity) {
        super(reactContext);
        mActivity = activity;
    }

    public String getName(){
        return "QRCode";
    }

    @ReactMethod
    public void scan() {
        IntentIntegrator integrator = new IntentIntegrator(mActivity);
        integrator.setDesiredBarcodeFormats(IntentIntegrator.QR_CODE_TYPES);
        integrator.setCaptureActivity(ScanActivity.class);
        integrator.setPrompt("Scan a challenge");
        integrator.initiateScan();

    }
}
