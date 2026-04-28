package com.quizapp.quiz_system.service;

import com.quizapp.quiz_system.dto.QuizDtos.QuestionPublicResponse;
import com.quizapp.quiz_system.dto.QuizDtos.QuestionRequest;
import com.quizapp.quiz_system.dto.QuizDtos.QuestionResponse;
import com.quizapp.quiz_system.dto.QuizDtos.QuizAdminResponse;
import com.quizapp.quiz_system.dto.QuizDtos.QuizDetailResponse;
import com.quizapp.quiz_system.dto.QuizDtos.QuizRequest;
import com.quizapp.quiz_system.dto.QuizDtos.QuizSummaryResponse;
import com.quizapp.quiz_system.exception.ApiException;
import com.quizapp.quiz_system.exception.ResourceNotFoundException;
import com.quizapp.quiz_system.model.Question;
import com.quizapp.quiz_system.model.Quiz;
import com.quizapp.quiz_system.repository.QuizRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;

    public QuizAdminResponse createQuiz(QuizRequest request) {
        Quiz quiz = Quiz.builder()
                .title(request.title().trim())
                .description(request.description().trim())
                .timeLimit(request.timeLimit())
                .category(normalizeCategory(request.category()))
                .questions(request.questions() == null ? List.of() : request.questions().stream().map(this::toQuestion).toList())
                .build();
        return toAdminResponse(quizRepository.save(quiz));
    }

    public QuizAdminResponse updateQuiz(String quizId, QuizRequest request) {
        Quiz quiz = getQuizEntity(quizId);
        quiz.setTitle(request.title().trim());
        quiz.setDescription(request.description().trim());
        quiz.setTimeLimit(request.timeLimit());
        quiz.setCategory(normalizeCategory(request.category()));
        if (request.questions() != null) {
            quiz.setQuestions(request.questions().stream().map(this::toQuestion).toList());
        }
        quiz.setUpdatedAt(Instant.now());
        return toAdminResponse(quizRepository.save(quiz));
    }

    public void deleteQuiz(String quizId) {
        if (!quizRepository.existsById(quizId)) {
            throw new ResourceNotFoundException("Quiz not found");
        }
        quizRepository.deleteById(quizId);
    }

    public QuizAdminResponse addQuestion(String quizId, QuestionRequest request) {
        Quiz quiz = getQuizEntity(quizId);
        quiz.getQuestions().add(toQuestion(request));
        quiz.setUpdatedAt(Instant.now());
        return toAdminResponse(quizRepository.save(quiz));
    }

    public List<QuizSummaryResponse> getQuizList() {
        return quizRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(quiz -> new QuizSummaryResponse(
                        quiz.getId(),
                        quiz.getTitle(),
                        quiz.getDescription(),
                        quiz.getTimeLimit(),
                        quiz.getCategory(),
                        quiz.getQuestions().size()
                ))
                .toList();
    }

    public List<QuizAdminResponse> getAdminQuizzes() {
        return quizRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toAdminResponse)
                .toList();
    }

    public QuizAdminResponse getAdminQuiz(String quizId) {
        return toAdminResponse(getQuizEntity(quizId));
    }

    public QuizDetailResponse getQuizForAttempt(String quizId) {
        Quiz quiz = getQuizEntity(quizId);
        return new QuizDetailResponse(
                quiz.getId(),
                quiz.getTitle(),
                quiz.getDescription(),
                quiz.getTimeLimit(),
                quiz.getCategory(),
                quiz.getQuestions().stream()
                        .map(question -> new QuestionPublicResponse(
                                question.getId(),
                                question.getQuestionText(),
                                question.getOptions()
                        ))
                        .toList()
        );
    }

    public List<String> getCategories() {
        return quizRepository.findAll().stream()
                .map(Quiz::getCategory)
                .filter(category -> category != null && !category.isBlank())
                .distinct()
                .sorted()
                .toList();
    }

    public Quiz getQuizEntity(String quizId) {
        return quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
    }

    private Question toQuestion(QuestionRequest request) {
        if (request.options().size() != 4) {
            throw new ApiException("Each question must contain exactly 4 options");
        }
        return Question.builder()
                .id(request.id() == null || request.id().isBlank() ? UUID.randomUUID().toString() : request.id())
                .questionText(request.questionText().trim())
                .options(request.options().stream().map(String::trim).toList())
                .correctAnswer(request.correctAnswer())
                .build();
    }

    private QuizAdminResponse toAdminResponse(Quiz quiz) {
        return new QuizAdminResponse(
                quiz.getId(),
                quiz.getTitle(),
                quiz.getDescription(),
                quiz.getTimeLimit(),
                quiz.getCategory(),
                quiz.getQuestions().stream()
                        .map(question -> new QuestionResponse(
                                question.getId(),
                                question.getQuestionText(),
                                question.getOptions(),
                                question.getCorrectAnswer()
                        ))
                        .toList(),
                quiz.getCreatedAt(),
                quiz.getUpdatedAt()
        );
    }

    private String normalizeCategory(String category) {
        return category == null || category.isBlank() ? null : category.trim();
    }
}
