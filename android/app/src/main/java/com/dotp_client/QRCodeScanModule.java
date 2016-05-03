package com.dotp_client;


import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.google.zxing.client.android.Intents;
import com.google.zxing.integration.android.IntentIntegrator;

public class QRCodeScanModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private Promise mPickerPromise;

    public QRCodeScanModule(ReactApplicationContext reactContext){
        super(reactContext);
        reactContext.addActivityEventListener(this);
    }

    public String getName(){
        return "QRCode";
    }

    @ReactMethod
    public void scan(Promise promise) {
        try {
            mPickerPromise = promise;
            Activity currentActivity = getCurrentActivity();
            IntentIntegrator integrator = new IntentIntegrator(currentActivity);
            integrator.setDesiredBarcodeFormats(IntentIntegrator.QR_CODE_TYPES);
            integrator.setCaptureActivity(ScanActivity.class);
            integrator.setPrompt("Scan a challenge");
            integrator.initiateScan();
        } catch (Exception e) {
            mPickerPromise.reject("Failed to start scan", e);
            mPickerPromise = null;
        }
    }

    @Override
    public void onActivityResult(final int requestCode, final int resultCode, final Intent data) {
        try {
            if (mPickerPromise != null) {
                if (data == null) {
                    Log.d("QR", "Null");
                    mPickerPromise.reject("Error", "Cancelled scan");
                } else {
                    String result = data.getStringExtra(Intents.Scan.RESULT);
                    Log.d("QR", result);
                    mPickerPromise.resolve(result);
                }
            }
            mPickerPromise = null;
        } catch (Exception e) {
            mPickerPromise = null;
        }
    }


}
