package com.quizapp.quiz_system.repository;

import com.quizapp.quiz_system.model.Quiz;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface QuizRepository extends MongoRepository<Quiz, String> {

    List<Quiz> findAllByOrderByCreatedAtDesc();

    List<Quiz> findByCategoryOrderByCreatedAtDesc(String category);
}
