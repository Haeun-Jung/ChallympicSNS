package com.ssafy.challympic.repository;

import com.ssafy.challympic.domain.Title;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class TitleRepository {

    private final EntityManager em;

    public void saveTitle(Title title) {
        em.persist(title);
    }

    public List<Title> findTitleByUserNo(int user_no) {
        return em.createQuery("select t from Title t where t.user.user_no = :user_no", Title.class)
                .setParameter("user_no", user_no)
                .getResultList();
    }

    // TODO : user no로 타이틀 리스트 가져오기
//    private List<Title>
}