package com.ssafy.challympic.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

import static javax.persistence.FetchType.LAZY;

@Entity
@Getter @Setter
public class Challenge {

    @Id @GeneratedValue
    @Column(name = "challenge_no")
    private int challenge_no;

//    @OneToMany(fetch = LAZY)
    @JoinColumn(name = "user_no")
    private int user_no;

    private LocalDateTime challenge_start;

    private LocalDateTime challenge_end;

    private String challenge_access;

    private String challenge_type;

    private String challenge_title;

    private String challenge_content;

    private boolean challenge_official;

    private int challenge_report;

//    @OneToOne(fetch = LAZY)
    @JoinColumn(name = "title_no")
    private int title_no;

    // 생성 메소드
    public static Challenge createChallenge(int user_no, LocalDateTime challenge_start, LocalDateTime challenge_end, String challenge_access, String challenge_type, String challenge_title, String challenge_content) {
        Challenge challenge = new Challenge();
        challenge.setUser_no(user_no);
        challenge.setChallenge_start(challenge_start);
        challenge.setChallenge_end(challenge_end);
        challenge.setChallenge_access(challenge_access);
        challenge.setChallenge_type(challenge_type);
        challenge.setChallenge_title(challenge_title);
        challenge.setChallenge_content(challenge_content);
        return challenge;
    }
}
