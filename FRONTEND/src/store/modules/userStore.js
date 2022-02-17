import router from "@/router/index.js";
import jwt_decode from "jwt-decode";
import {
  login,
  join,
  confirmEmail,
  confirmNickname,
  getUser,
  changePassword,
  modifyUser,
  deleteUser,
  getInterest,
  deleteInterest,
  getSubscription,
  deleteSubscription,
  getQnA,
  registerQuestion,
  getAlertList,
  setInterests
} from "@/api/user.js";

const userStore = {
  namespaced: true,
  state: {
    isLoggedIn: false,
    loginFailed: false,
    userNo: "",
    userTitle: "",
    userNickname: "",
    userEmail: "",
    userInfo: null,
    tempUserEmail: "", 
    filePath: "",
    fileSavedName: "",
    possibleEmail: false,
    possibleNickname: false,
    changePassword: false,
    pushAlert: true,
    listInterest: null,
    listSubscription: [""],
    listQnA: null,
    alertList: null,
  },
  getters: {},
  mutations: {
    LOGIN(state, data) {
      state.isLoggedIn = true;
      state.userNo = data.user_no;
      state.userTitle = data.user_title;
      state.userNickname = data.user_nickname;
      state.userEmail = data.user_email;
    },
    LOGIN_FAILED(state, fail) {
      state.loginFailed = fail;
    },
    LOGOUT(state) {
      state.isLoggedIn = false;
      state.userNo = 0;
      state.userInfo = null;
      state.filePath = "";
      state.fileSavedName = "";
      state.userEmail = "";
      state.listInterest = null;
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo;
      state.filePath = userInfo.file_path;
      state.fileSavedName = userInfo.file_savedname;
    },
    CONFIRM_EMAIL(state, isDuplicated) {
      state.possibleEmail = !isDuplicated;
    },
    CONFIRM_NICKNAME(state, isDuplicated) {
      state.possibleNickname = !isDuplicated;
    },
    CHANGE_PASSWORD(state, changed) {
      state.changePassword = changed;
    },
    SET_INTERESTS(state, interests) {
      state.listInterest = interests;
    },
    SET_SUBSCRIPTION(state, subscriptions){
      state.listSubscription = subscriptions
      console.log("구독조회3")
      console.log(state.listSubscription);
    },
    SET_QNA(state, qna) {
      state.listQnA = qna;
    },
    SET_ALERT_LIST(state, alertList) {
      state.alertList = alertList;
    },
    DELETE_ALERT(state) {
      state.alertList = null;
    },
    TEMP_USER_EMAIL(state, tempUserEmail){
      state.tempUserEmail = tempUserEmail;
    }
  },
  actions: {
    async login({ commit, dispatch }, user) {
      await login(
        user,
        (response) => {
          const { data } = response;
          if (data.success) {
            commit("LOGIN", data.data);
            commit("LOGIN_FAILED", false);
            dispatch("getAlertList", data.data.user_no);
            sessionStorage.setItem(
              "Authorization",
              response.headers["authorization"]
            );
            // router.push({ name: "Main" });
          } else {
            commit("LOGIN_FAILED", true);
          }
        },
        () => {
          commit("LOGIN_FAILED", true);
        }
      );
    },
    async join({ commit }, user) {
      await join(
        user,
        (response) => {
          const { data } = response;
          if (data.success) {
            commit("TEMP_USER_EMAIL", user.user_email);
            router.push({ name: "SetInterests" });
          }
        },
        (err) => {
          console.log(err);
          console.log("회원가입 실패");
        }
      );
    },
    async setInterests( state, info){
      // console.log("스토어");
      // console.log(info.user_email);
      // console.log(info.interests);

      await setInterests(
        info.user_email,
        info.interests,
        () => {
          // console.log("조인 후 인터레스트");
          // console.log(response);
          router.push({ name: "Login" });
        },
        (err) => {
          // console.log("조인후 인터레스트 불가")
          console.log(err);
        
        }
      );
    },
    getUserInfo({ commit }, token) {
      let decode_token = jwt_decode(token);
      getUser(
        decode_token.user_no,
        (response) => {
          if (response.data.code === 200) {
            console.log(response.data.data);
            commit("SET_USER_INFO", response.data.data);
            window.location.href = "/recent";
          } else {
            console.log("유저 정보 없음!!");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
    async confirmEmail({ commit }, email) {
      await confirmEmail(
        email,
        (response) => {
          const { data } = response;
          commit("CONFIRM_EMAIL", data.data);
        },
        () => {}
      );
    },
    async confirmNickname({ commit }, nickname) {
      await confirmNickname(
        nickname,
        (response) => {
          const { data } = response;
          commit("CONFIRM_NICKNAME", data.data);
        },
        () => {}
      );
    },
    async changePassword({ commit }, tokenUser) {
      let token = tokenUser.token;
      let decode_token = jwt_decode(token);
      let user = {
        user_pwd: tokenUser.user_pwd,
        user_newpwd: tokenUser.user_newpwd,
      };
      await changePassword(
        decode_token.user_no,
        user,
        (response) => {
          console.log(response);
          if (response.data.code === 200) {
            console.log("200안에서 찍음", response.data.code);
            commit("CHANGE_PASSWORD", true);
          } else if (response.data.code === 204) {
            console.log("204안에서 찍음", response.data.code);
            commit("CHANGE_PASSWORD", false);
          } else {
            console.log("변경 실패");
          }
        },
        (error) => {
          console.log("error", error);
        }
      );
    },
    async modifyUser({ commit }, tokenUser) {
      let token = tokenUser.token;
      let decode_token = jwt_decode(token);
      let user = tokenUser.file;
      console.log("user ", user);
      await modifyUser(
        decode_token.user_no,
        user,
        (response) => {
          if (response.data.code === 200) {
            console.log("modifyUser: ", response.data.data);
            commit("SET_USER_INFO", response.data.data);
          } else {
            console.log("변경 실패");
          }
        },
        (error) => {
          console.log("error", error);
        }
      );
    },
    deleteUser({ commit }, token) {
      let decode_token = jwt_decode(token);
      deleteUser(
        decode_token.user_no,
        (response) => {
          if (response.data.code === 200) {
            commit("SET_USER_INFO", null);
            sessionStorage.removeItem("Authorization");
            console.log("탈퇴 성공");
          } else {
            console.log("탈퇴 실패");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
    async getInterest({ commit }, token) {
      let decode_token = jwt_decode(token);
      await getInterest(
        decode_token.user_no,
        (response) => {
          if (response.data.code === 200) {
            console.log("getInter: ", response);
            commit("SET_INTERESTS", response.data.data);
          } else {
            console.log("관심사 가져오기 오류!");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
    async deleteInterest(state, tokenTag) {
      let token = tokenTag.token;
      let decode_token = jwt_decode(token);
      console.log("decode ", decode_token);
      let tag = tokenTag.no;
      console.log("tag ", tag);
      await deleteInterest(
        decode_token.user_no,
        tag,
        (response) => {
          console.log(response);
          if (response.data.code === 200) {
            console.log("삭제 성공");
          } else {
            console.log("삭제 실패");
          }
        },
        (error) => {
          console.log("error", error);
        }
      );
    },
    async deleteSubscription(state, tokenSub) {
      let token = tokenSub.token;
      let decode_token = jwt_decode(token);
      console.log("decode ", decode_token);
      let sub = tokenSub.no;
      console.log("sub ", sub);
      await deleteSubscription(
        sub,
        decode_token.user_no,
        (response) => {
          console.log(response);
          if (response.data.code === 200) {
            console.log("구독 삭제 성공");
          } else {
            console.log("구독 삭제 실패");
          }
        },
        (error) => {
          console.log("error", error);
        }
      );
    },
    async getSubscription({commit}, tokenSub){
      let token = tokenSub.token;
      let decode_token = jwt_decode(token);
      await getSubscription(
        decode_token.user_no,
        (response) => {
          if(response.data.code == 200){
            commit("SET_SUBSCRIPTION",response.data.data)
          }
        },
        (error) => {
          console.log(error);
        }
      )
    },
    async getQnA({ commit }, token) {
      let decode_token = jwt_decode(token);
      await getQnA(
        decode_token.user_no,
        (response) => {
          if (response.data.code === 200) {
            console.log(response);
            commit("SET_QNA", response.data.data);
          } else {
            console.log("문의하기 오류!");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
    registerQuestion({ commit }, tokenQnA) {
      let token = tokenQnA.token;
      let decode_token = jwt_decode(token);
      let qna = {
        qna_title: tokenQnA.qna_title,
        qna_question: tokenQnA.qna_question,
      };
      registerQuestion(
        decode_token.user_no,
        qna,
        (response) => {
          if (response.data.code === 200) {
            console.log("qna response: ", response);
            commit("SET_QNA", response.data.data.data);
          } else {
            console.log("문의 등록 오류!");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
    getAlertList({ commit }, userNo) {
      getAlertList(
        userNo,
        (response) => {
          commit("SET_ALERT_LIST", response.data.data);
          console.log("알림 가져오기 성공");
        },
        () => {
          console.log("알림 가져오기 오류");
        }
      );
    },
  },
};

export default userStore;
