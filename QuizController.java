package com.quizapp.quiz_system.controller;

import com.quizapp.quiz_system.dto.QuizDtos.QuizDetailResponse;
import com.quizapp.quiz_system.dto.QuizDtos.QuizSubmissionRequest;
import com.quizapp.quiz_system.dto.QuizDtos.QuizSubmissionResponse;
import com.quizapp.quiz_system.dto.QuizDtos.QuizSummaryResponse;
import com.quizapp.quiz_system.dto.ResultDtos.LeaderboardEntryResponse;
import com.quizapp.quiz_system.security.CustomUserDetails;
import com.quizapp.quiz_system.service.QuizService;
import com.quizapp.quiz_system.service.ResultService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;
    private final ResultService resultService;

    @GetMapping("/quiz/list")
    public List<QuizSummaryResponse> getQuizzes() {
        return quizService.getQuizList();
    }

    @GetMapping("/quiz/{id}")
    public QuizDetailResponse getQuiz(@PathVariable String id) {
        return quizService.getQuizForAttempt(id);
    }

    @PostMapping("/quiz/{id}/submit")
    public QuizSubmissionResponse submitQuiz(
            @PathVariable String id,
            @Valid @RequestBody QuizSubmissionRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return resultService.submitQuiz(id, currentUser.getId(), request);
    }

    @GetMapping("/leaderboard")
    public List<LeaderboardEntryResponse> getLeaderboard() {
        return resultService.getLeaderboard();
    }
}
