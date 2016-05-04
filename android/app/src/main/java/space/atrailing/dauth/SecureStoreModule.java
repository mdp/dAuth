package space.atrailing.dauth;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Base64;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;

import java.security.SecureRandom;

public class SecureStoreModule extends ReactContextBaseJavaModule {

    private final SharedPreferences mSharedPref;

    public SecureStoreModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mSharedPref = reactContext.getSharedPreferences("space.atrailing.dauth", Context.MODE_PRIVATE);
    }

    @Override
    public String getName() {
        return "SecureStore";
    }

    @ReactMethod
    public void loadKey(Promise promise) {
        byte[] key = new byte[32];
        if (mSharedPref.contains("dAuthKey")) {
            String keyStr = mSharedPref.getString("dAuthKey", "");
            key = Base64.decode(keyStr, Base64.DEFAULT);
        } else {
            SecureRandom sr = new SecureRandom();
            sr.nextBytes(key);
            String keyB64 = Base64.encodeToString(key, Base64.DEFAULT);
            SharedPreferences.Editor editor = mSharedPref.edit();
            editor.putString("dAuthKey", keyB64);
            editor.apply();
        }
        WritableArray outputBytes = Arguments.createArray();
        for (byte aKey : key) {
            outputBytes.pushInt((int) (aKey & 0xFF));
        }
        promise.resolve(outputBytes);
    }
}
