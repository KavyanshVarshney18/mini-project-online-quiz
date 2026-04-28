package com.quizapp.quiz_system.dto;

import java.time.Instant;
import java.util.List;

public final class ResultDtos {

    private ResultDtos() {
    }

    public record ResultResponse(
            String id,
            String userId,
            String userName,
            String quizId,
            String quizTitle,
            int score,
            int totalQuestions,
            double percentage,
            Instant attemptedAt
    ) {
    }

    public record DashboardStatsResponse(
            long totalQuizzes,
            long totalUsers,
            long totalAttempts
    ) {
    }

    public record LeaderboardEntryResponse(
            String userId,
            String userName,
            int score,
            int totalQuestions,
            double percentage,
            Instant attemptedAt
    ) {
    }

    public record AdminResultsResponse(
            DashboardStatsResponse stats,
            List<ResultResponse> results,
            List<LeaderboardEntryResponse> topScorers
    ) {
    }
}
