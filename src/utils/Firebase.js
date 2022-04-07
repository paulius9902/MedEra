import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCRhi5anDIS9wEss_JXQNZAABiPgqySeiw",
    authDomain: "medera-storage.firebaseapp.com",
    projectId: "medera-storage",
    storageBucket: "medera-storage.appspot.com",
    messagingSenderId: "407694631265",
    appId: "1:407694631265:web:2f37638da3ee9db559e520"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { storage, app };