package com.quizapp.quiz_system.model;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "results")
public class Result {

    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private String quizId;

    private String userName;
    private String quizTitle;
    private Integer score;
    private Integer totalQuestions;
    private Double percentage;

    @Builder.Default
    private Instant attemptedAt = Instant.now();
}
