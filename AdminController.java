package com.quizapp.quiz_system.controller;

import com.quizapp.quiz_system.dto.QuizDtos.QuestionRequest;
import com.quizapp.quiz_system.dto.QuizDtos.QuizAdminResponse;
import com.quizapp.quiz_system.dto.QuizDtos.QuizRequest;
import com.quizapp.quiz_system.dto.ResultDtos.AdminResultsResponse;
import com.quizapp.quiz_system.dto.ResultDtos.DashboardStatsResponse;
import com.quizapp.quiz_system.dto.ResultDtos.LeaderboardEntryResponse;
import com.quizapp.quiz_system.service.QuizService;
import com.quizapp.quiz_system.service.ResultService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final QuizService quizService;
    private final ResultService resultService;

    @PostMapping("/quiz")
    @ResponseStatus(HttpStatus.CREATED)
    public QuizAdminResponse createQuiz(@Valid @RequestBody QuizRequest request) {
        return quizService.createQuiz(request);
    }

    @GetMapping("/quiz")
    public List<QuizAdminResponse> getQuizzes() {
        return quizService.getAdminQuizzes();
    }

    @GetMapping("/quiz/{id}")
    public QuizAdminResponse getQuiz(@PathVariable String id) {
        return quizService.getAdminQuiz(id);
    }

    @PutMapping("/quiz/{id}")
    public QuizAdminResponse updateQuiz(@PathVariable String id, @Valid @RequestBody QuizRequest request) {
        return quizService.updateQuiz(id, request);
    }

    @DeleteMapping("/quiz/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteQuiz(@PathVariable String id) {
        quizService.deleteQuiz(id);
    }

    @PostMapping("/question/{quizId}")
    public QuizAdminResponse addQuestion(@PathVariable String quizId, @Valid @RequestBody QuestionRequest request) {
        return quizService.addQuestion(quizId, request);
    }

    @GetMapping("/results")
    public AdminResultsResponse getAllResults() {
        return resultService.getAdminResults();
    }

    @GetMapping("/dashboard")
    public DashboardStatsResponse getStats() {
        return resultService.getDashboardStats();
    }

    @GetMapping("/analytics/top-scorers")
    public List<LeaderboardEntryResponse> getTopScorers() {
        return resultService.getLeaderboard();
    }

    @GetMapping("/categories")
    public List<String> getCategories() {
        return quizService.getCategories();
    }
}
