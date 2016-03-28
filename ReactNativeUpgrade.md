## iOS

1. Add Realm back to the Project - https://realm.io/docs/react-native/latest/
2. Install React Native Camera - https://github.com/lwansbrough/react-native-camera
3. Deployment target 9.0 and up (Realm only works on 8+, Universal links 9+)
4. Add swift files, create bridge when asked
5. Fix Realm for release/archive https://github.com/realm/realm-js/issues/345
  - Strip Debug Symbols During Copy: No
  - Strip Linked Product: No
  - Enable Bitcode No
6. Add to Info.plist to stop encryption questions `<key>ITSAppUsesNonExemptEncryption</key><false/>`
7. Add Univeral links 'applinks:dauth.atrailing.space'
