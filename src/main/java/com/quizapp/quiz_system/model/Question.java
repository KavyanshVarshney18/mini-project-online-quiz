package com.quizapp.quiz_system.model;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Question {

    private String id;
    private String questionText;
    private List<String> options;
    private Integer correctAnswer;
}
