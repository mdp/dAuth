package space.atrailing.dauth;

import android.content.Intent;
import android.util.Log;

import com.facebook.react.ReactActivity;
import io.realm.react.RealmReactPackage;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.zxing.client.android.Intents;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "dotp_client";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    public void onMyActivityResult(int requestCode, int resultCode, Intent data) {
        ReactContext reactContext = (ReactContext)this.getApplicationContext();
        if (data == null) {
            Log.d("QR", "Null");
            if (reactContext != null) {
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                       .emit("qrScanCancel", 0);
            }
            return;
        }
        String result = data.getStringExtra(Intents.Scan.RESULT);
        Log.d("QR", result);
        if (reactContext != null) {
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("qrScan", result);
        }
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
                new RealmReactPackage(),
                new SecureRandomPackage(),
                new QRCodeScanPackage(),
                new SecureStorePackage(),
                new RCTCameraPackage()
        );
    }
}
