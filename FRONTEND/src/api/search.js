import { apiInstance } from "./index.js";

const api = apiInstance();

/* 전체 검색 for All Tags */
function getSearchList(success, fail) {
  api.get(`/challympic/search`).then(success).catch(fail); //hes saying remove this
}
/*태그 검색 결과 */
function searchTagList(searchKey, success, fail) {
  api
    .post(`/challympic/search/tag`, JSON.stringify(searchKey))
    .then(success)
    .catch(fail);
}

/*최신 api 확인해보니까 challengeno로 챌린지 가져오는게 그냥 list이던데 혹시 위에거랑 같은거면 한번 확인해주세여! */
function list(challenges, success, fail) {
  api
    .post(`/challympic/challenge/post`, JSON.stringify(challenges))
    .then(success)
    .catch(fail);
}

function getRecommend(userNo, success, fail) {
  api
<<<<<<< HEAD
    .get(`/challympic/activity/${userNo}`, JSON.stringify(userNo))
=======
    .get(`/challympic/activity/${userNo}`)
>>>>>>> f76ce1b16c1f9fe5031bfef83a77b1836fb6e0a0
    .then(success)
    .catch(fail);
}

export { getSearchList, searchTagList, list, getRecommend };
