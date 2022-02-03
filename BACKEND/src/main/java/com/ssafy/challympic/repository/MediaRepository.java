package com.ssafy.challympic.repository;

import com.ssafy.challympic.domain.Challenge;
import com.ssafy.challympic.domain.Media;
import com.ssafy.challympic.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;

@Repository
@RequiredArgsConstructor
public class MediaRepository {

    private final EntityManager em;

    public void save(Media media){
        em.persist(media);
    }

    public Media findByFileNo(Long file_no){
        return em.find(Media.class, file_no);
    }

    public void deleteMedia(Long file_no){
        em.remove(findByFileNo(file_no));
    }
}
