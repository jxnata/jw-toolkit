// Minimal setup for Jest tests.
// The react-native/jest/setup.js from RN 0.81 uses ESM imports which
// are incompatible with pnpm's node layout. We provide this lightweight
// replacement so Jest can start without that file.
global.IS_REACT_ACT_ENVIRONMENT = true
global.IS_REACT_NATIVE_TEST_ENVIRONMENT = true
