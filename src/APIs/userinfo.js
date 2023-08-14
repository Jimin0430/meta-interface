import axios from "axios";

axios.defaults.baseURL = "https://www.app.vpspace.net/";

export function getUserInfo(userIndex) {
  return axios.post("/userinfo", {
    index: userIndex,
  });
}

export function getUserInterested() {
  return axios.get("/userinfo/interested");
}

export function getTeamIndex(userLoginString) {
  return axios.post("/userinfo/emailtoteam", {
    email: userLoginString,
  });
}