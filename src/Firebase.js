import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyClXE0tPlMAqZ5bQpf5t_eak_cykE-PQvE",
    authDomain: "music-player-e7629.firebaseapp.com",
    databaseURL: "https://music-player-e7629-default-rtdb.firebaseio.com",
    projectId: "music-player-e7629",
    storageBucket: "music-player-e7629.appspot.com",
    messagingSenderId: "1019128513737",
    appId: "1:1019128513737:web:08f13be09b88679ce7f918",
    measurementId: "G-KZEZZGPMDE"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app, 'gs://music-player-e7629.appspot.com');

export {app, storage};