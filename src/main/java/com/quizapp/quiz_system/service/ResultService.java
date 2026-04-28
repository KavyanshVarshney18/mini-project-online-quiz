package com.quizapp.quiz_system.service;

import com.quizapp.quiz_system.dto.QuizDtos.QuizSubmissionRequest;
import com.quizapp.quiz_system.dto.QuizDtos.QuizSubmissionResponse;
import com.quizapp.quiz_system.dto.ResultDtos.AdminResultsResponse;
import com.quizapp.quiz_system.dto.ResultDtos.DashboardStatsResponse;
import com.quizapp.quiz_system.dto.ResultDtos.LeaderboardEntryResponse;
import com.quizapp.quiz_system.dto.ResultDtos.ResultResponse;
import com.quizapp.quiz_system.exception.ApiException;
import com.quizapp.quiz_system.model.Question;
import com.quizapp.quiz_system.model.Quiz;
import com.quizapp.quiz_system.model.Result;
import com.quizapp.quiz_system.model.User;
import com.quizapp.quiz_system.repository.QuizRepository;
import com.quizapp.quiz_system.repository.ResultRepository;
import com.quizapp.quiz_system.repository.UserRepository;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ResultService {

    private final ResultRepository resultRepository;
    private final QuizRepository quizRepository;
    private final UserRepository userRepository;

    public QuizSubmissionResponse submitQuiz(String quizId, String userId, QuizSubmissionRequest request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ApiException("Quiz not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found"));

        List<Question> questions = quiz.getQuestions();
        if (questions.isEmpty()) {
            throw new ApiException("Quiz has no questions");
        }

        if (request.answers() == null || request.answers().size() != questions.size()) {
            throw new ApiException("Answers count must match total questions");
        }

        int score = 0;
        for (int i = 0; i < questions.size(); i++) {
            Integer answer = request.answers().get(i);
            if (answer != null && answer.equals(questions.get(i).getCorrectAnswer())) {
                score++;
            }
        }

        double percentage = (score * 100.0) / questions.size();
        Result result = resultRepository.save(Result.builder()
                .userId(user.getId())
                .userName(user.getName())
                .quizId(quiz.getId())
                .quizTitle(quiz.getTitle())
                .score(score)
                .totalQuestions(questions.size())
                .percentage(percentage)
                .attemptedAt(Instant.now())
                .build());

        return new QuizSubmissionResponse(
                result.getId(),
                result.getQuizId(),
                result.getQuizTitle(),
                result.getScore(),
                result.getTotalQuestions(),
                result.getPercentage(),
                result.getAttemptedAt()
        );
    }

    public AdminResultsResponse getAdminResults() {
        return new AdminResultsResponse(getDashboardStats(), mapResults(resultRepository.findAllByOrderByAttemptedAtDesc()), getLeaderboard());
    }

    public List<ResultResponse> getUserResults(String requestedUserId, String currentUserId) {
        if (!requestedUserId.equals(currentUserId)) {
            throw new ApiException("You can only view your own results");
        }
        return mapResults(resultRepository.findByUserIdOrderByAttemptedAtDesc(requestedUserId));
    }

    public DashboardStatsResponse getDashboardStats() {
        return new DashboardStatsResponse(
                quizRepository.count(),
                userRepository.count(),
                resultRepository.count()
        );
    }

    public List<LeaderboardEntryResponse> getLeaderboard() {
        return resultRepository.findTop10ByOrderByScoreDescPercentageDescAttemptedAtAsc().stream()
                .map(result -> new LeaderboardEntryResponse(
                        result.getUserId(),
                        result.getUserName(),
                        result.getScore(),
                        result.getTotalQuestions(),
                        result.getPercentage(),
                        result.getAttemptedAt()
                ))
                .toList();
    }

    private List<ResultResponse> mapResults(List<Result> results) {
        return results.stream()
                .map(result -> new ResultResponse(
                        result.getId(),
                        result.getUserId(),
                        result.getUserName(),
                        result.getQuizId(),
                        result.getQuizTitle(),
                        result.getScore(),
                        result.getTotalQuestions(),
                        result.getPercentage(),
                        result.getAttemptedAt()
                ))
                .toList();
    }
}
