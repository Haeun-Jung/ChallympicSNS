package com.ssafy.challympic.api;

import com.ssafy.challympic.api.Dto.ChallengeDto;
import com.ssafy.challympic.api.Dto.PostDto;
import com.ssafy.challympic.api.Dto.SearchDto;
import com.ssafy.challympic.domain.*;
import com.ssafy.challympic.service.ChallengeService;
import com.ssafy.challympic.service.SearchService;
import com.ssafy.challympic.service.TagService;
import com.ssafy.challympic.service.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class SearchApiController {

    private final SearchService searchService;
    private final UserService userService;
    private final TagService tagService;
    private final ChallengeService challengeService;

    @GetMapping("/search")
    public Result getSearchList() {
        List<Tag> tagList = searchService.findTagList();
        List<User> userList = searchService.findUserList();

        Map<String, List> data = new HashMap<>();

        data.put("tagList", tagList);
        data.put("userList", userList);

        return new Result(true, HttpStatus.OK.value(), data);
    }

    @GetMapping("/search/tag/{tag}")
    public Result searchTagList(@PathVariable String tag, @RequestBody UserRequest request) {
        List<Challenge> challenges = searchService.findChallengeListByTagContent("#" + tag);
        List<Post> posts = searchService.findPostListByTagContent("#" + tag);

        List<ChallengeDto> challengeList = challenges.stream()
                .map(c -> new ChallengeDto(c))
                .collect(Collectors.toList());
        List<PostDto> postList = posts.stream()
                .map(p -> new PostDto(p))
                .collect(Collectors.toList());

        Map<String, List> data = new HashMap<>();
        data.put("challengeList", challengeList);
        data.put("postList", postList);

        // 검색 기록 저장
        User user = userService.findUser(request.user_no);
        searchService.saveSearchRecord("#" + tag, user);

        Tag findTag = tagService.findTagByTagContent("#" + tag);

        if(findTag.getIsChallenge() != null && findTag.getIsChallenge().equals("challenge")) {
            SearchChallenge searchChallenge = new SearchChallenge();
            searchChallenge.setChallenge(challengeService.findChallengeByTitle("#" + tag).get(0));
            searchChallenge.setUser(user);
            searchService.saveSearchChallenge(searchChallenge);
        }

        return new Result(true, HttpStatus.OK.value(), data);
    }

    @Data
    static class UserRequest {
        private int user_no;
    }

    @GetMapping("/search/recent/user/{userNo}")
    public Result searchRecentListByUser(@PathVariable int userNo){
        List<Search> searchs = searchService.findTagListByUserNo(userNo);
        List<SearchDto> searchList = searchs.stream()
                .map(s -> new SearchDto(s.getSearch_no(), s.getUser().getUser_no(), s.getTag_no(), s.getTag_content(), s.getSearch_content(), s.getSearch_regdate()))
                .collect(Collectors.toList());
        return new Result(true, HttpStatus.OK.value(), searchList);
    }

    @GetMapping("/search/trending")
    public Result searchTrending() {
        List<Challenge> challenges = searchService.findTrendChallenge();
        List<ChallengeDto> challengeList = challenges.stream()
                .map(c -> new ChallengeDto(c))
                .collect(Collectors.toList());
        return new Result(true, HttpStatus.OK.value(), challengeList);
    }

    @GetMapping("/search/rank")
    public Result getRank() {
        List<User> userList = searchService.findRank();
        return new Result(true, HttpStatus.OK.value(), userList);
    }

}
