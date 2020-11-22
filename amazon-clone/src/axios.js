import axios from "axios";

// imagine it like a JS fetch API

const instance = axios.create({
  // THE API (cloud function) URL
  baseURL: 'https://us-central1-clone-23527.cloudfunctions.net/api'
    // "http://localhost:5001/challenge-4b2b2/us-central1/api",
});

export default instance;