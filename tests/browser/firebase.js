"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var app_1 = __importDefault(require("firebase/app"));
require("firebase/auth");
require("firebase/firestore");
/**
 * Preparation for testing.
 * 1. Have a firebase project ready for testing. Preferrably a blank.
 * 2. Enable email/password login method and create a test user.
 * 3. Make sure firestore is enabled and user has read write access.
 * 4. Copy the firebase project config.
 */
////////////////////////////////////////////////////////
/* UPDATE THE CONFIG BELOW BEFORE RUNNING TESTS */
var config = {
    apiKey: "AIzaSyBh4rBHKNn7D0DrCKlzGXuBd4uSl5dwvDA",
    authDomain: "cutefire-5e5be.firebaseapp.com",
    databaseURL: "https://cutefire-5e5be.firebaseio.com",
    projectId: "cutefire-5e5be",
    storageBucket: "cutefire-5e5be.appspot.com",
    messagingSenderId: "59997526440"
};
////////////////////////////////////////////////////////
var user = ["test@arohanyas.com", "welcome"];
////////////////////////////////////////////////////////
var fire = app_1["default"].initializeApp(config, "testapp");
console.info("Firebase initialised");
exports["default"] = fire;
