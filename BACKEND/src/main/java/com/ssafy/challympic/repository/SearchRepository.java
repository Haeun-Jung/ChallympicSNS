package com.ssafy.challympic.repository;

import com.ssafy.challympic.domain.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.util.Calendar;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class SearchRepository {

    private final EntityManager em;


    public List<Tag> findTagList() {
        return em.createQuery("select t from Tag t", Tag.class)
                .getResultList();
    }

    public List<User> findUserList() {
        return em.createQuery("select u from User u", User.class)
                .getResultList();
    }

    public List<Tag> findTagListByTagContent(String tag_content) {
        return em.createQuery("select t from Tag t where t.tag_content = :tag_content", Tag.class)
                .setParameter("tag_content", tag_content)
                .getResultList();
    }

    public List<Search> findTagListByUserNo(int userNo) {
        return em.createQuery("select s from Search s where s.user.user_no = :userNo", Search.class)
                .setParameter("userNo", userNo)
                .getResultList();
    }

    public List<Challenge> findChallengeByTagContent(String tag) {
        return em.createQuery(
                "select ct.challenge from ChallengeTag ct where ct.tag.tag_no = " +
                        "(select t.tag_no from Tag t where t.tag_content = :tag)", Challenge.class)
                .setParameter("tag", tag)
                .getResultList();
    }


    public List<Post> findPostByTagContent(String tag) {
        return em.createQuery(
                "select p from Post p where p.post_no = " +
                        "(select pt.post.post_no from PostTag pt where pt.tag = " +
                        "(select t from Tag t where t.tag_content = :tag))", Post.class)
                .setParameter("tag", tag)
                .getResultList();
    }

    public void setSearchChallenge(SearchChallenge searchChallenge) {
        em.persist(searchChallenge);
    }

    public List<Challenge> findChallengeByTrend() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.HOUR, -1);
        return em.createQuery("select sc.challenge from SearchChallenge sc where sc.search_regdate < :cur", Challenge.class) //TODO: 시간 설정 어떡함????????
                .setParameter("cur", calendar)
                .getResultList();
    }

    /**
     * 타이틀 수 내림차순으로 정렬 후 해당 유저
     * TODO : jpql 너무 어렵습니다...... 수정 필요합니다...
     * @return
     */
    public List<User> findRank() {
        return em.createQuery("select t.user from Title t where t.user.user_no = (select count(t) from Title t group by t.user.user_no)", User.class)
                .getResultList();
    }

    public void saveSearchRecord(Search search) {
        em.persist(search);
    }
}
