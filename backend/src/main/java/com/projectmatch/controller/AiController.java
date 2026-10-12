package com.projectmatch.controller;

import com.projectmatch.dto.request.AiRequest;
import com.projectmatch.dto.response.AiResponse;
import com.projectmatch.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/project-ideas")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AiResponse> getProjectIdeas(@RequestBody(required = false) AiRequest request) {
        AiRequest req = request != null ? request : new AiRequest();
        return ResponseEntity.ok(aiService.generateProjectIdeas(req));
    }

    @PostMapping("/refine-proposal")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AiResponse> refineProposal(@RequestBody AiRequest request) {
        return ResponseEntity.ok(aiService.refineProposal(request));
    }

    @PostMapping("/skill-gap")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AiResponse> analyzeSkillGaps(@RequestBody AiRequest request) {
        return ResponseEntity.ok(aiService.analyzeSkillGaps(request));
    }

    @PostMapping("/chat")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AiResponse> chat(@RequestBody AiRequest request) {
        return ResponseEntity.ok(aiService.chat(request));
    }
}
