package com.quizapp.quiz_system.repository;

import com.quizapp.quiz_system.model.Result;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ResultRepository extends MongoRepository<Result, String> {

    List<Result> findAllByOrderByAttemptedAtDesc();

    List<Result> findByUserIdOrderByAttemptedAtDesc(String userId);

    List<Result> findTop10ByOrderByScoreDescPercentageDescAttemptedAtAsc();
}
