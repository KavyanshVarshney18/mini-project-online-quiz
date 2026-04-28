package com.quizapp.quiz_system.controller;

import com.quizapp.quiz_system.dto.ResultDtos.ResultResponse;
import com.quizapp.quiz_system.security.CustomUserDetails;
import com.quizapp.quiz_system.service.ResultService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final ResultService resultService;

    @GetMapping("/results/{userId}")
    public List<ResultResponse> getUserResults(
            @PathVariable String userId,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return resultService.getUserResults(userId, currentUser.getId());
    }
}
