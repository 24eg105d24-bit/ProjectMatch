package com.projectmatch.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectmatch.dto.request.AiRequest;
import com.projectmatch.dto.response.AiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AiService {

    private static final Logger log = LoggerFactory.getLogger(AiService.class);

    @Value("${app.ai.api-key:${AI_API_KEY:}}")
    private String apiKey;

    @Value("${app.ai.model:gemini-1.5-flash}")
    private String modelName;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AiService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public AiResponse generateProjectIdeas(AiRequest request) {
        String topic = request.getTopic() != null ? request.getTopic() : "AI & Cloud Computing";
        String category = request.getCategory() != null ? request.getCategory() : "Machine Learning";

        String prompt = String.format(
                "Generate 3 innovative student capstone project ideas for topic '%s' in category '%s'. " +
                "For each idea provide: Title, Problem Statement, Recommended Tech Stack, and Suggested Team Roles.",
                topic, category
        );

        String aiResult = callLlm(prompt);
        if (aiResult != null && !aiResult.isBlank()) {
            AiResponse resp = new AiResponse(aiResult);
            resp.setSuggestions(List.of(
                    "Cloud-Native " + topic + " Telemetry Platform",
                    "Federated " + category + " for Privacy-Preserving Collaboration",
                    "Autonomous Edge Agent using " + topic
            ));
            resp.setRecommendedRoles(List.of("Full Stack Engineer", "MLOps Engineer", "Backend Developer", "UI/UX Researcher"));
            return resp;
        }

        // Deterministic Fallback
        AiResponse resp = new AiResponse(String.format(
                "### Suggested Capstone Concepts for %s (%s)\n\n" +
                "1. **Smart Campus Resource Optimizer**\n" +
                "   - *Problem:* Inefficient scheduling and space allocation across campus labs.\n" +
                "   - *Tech Stack:* Spring Boot, React, Redis, PostgreSQL, TensorFlow Lite.\n" +
                "   - *Roles:* Full-Stack Lead, Backend Architect, ML Specialist.\n\n" +
                "2. **Adaptive Peer-to-Peer Mentorship Platform**\n" +
                "   - *Problem:* Lack of personalized skill matching for senior-junior student pairings.\n" +
                "   - *Tech Stack:* Java, Spring MVC, React, MySQL, Neo4j Graph DB.\n" +
                "   - *Roles:* Frontend Engineer, Data Modeler, Security Specialist.\n\n" +
                "3. **Decentralized Verification for Academic Credentials**\n" +
                "   - *Problem:* Tamper-proof issuance and verification of student capstone artifacts.\n" +
                "   - *Tech Stack:* Spring Boot, Web3j, React, IPFS, Docker.\n" +
                "   - *Roles:* Distributed Systems Engineer, Smart Contract Dev, QA Engineer.",
                topic, category
        ));
        resp.setSuggestions(List.of("Resource Optimizer", "Mentorship Platform", "Credential Verification"));
        resp.setRecommendedRoles(List.of("Full Stack Lead", "ML Specialist", "Backend Architect", "UI/UX Designer"));
        return resp;
    }

    public AiResponse refineProposal(AiRequest request) {
        String originalProposal = request.getProposalText() != null ? request.getProposalText().trim() : "";
        if (originalProposal.isBlank()) {
            originalProposal = "We want to build a platform that matches students into teams based on skills.";
        }

        String prompt = "Review and refine this student engineering project proposal. Enhance the scope, add clear milestones, clarify technical deliverables, and ensure academic rigor:\n\n" + originalProposal;

        String aiResult = callLlm(prompt);
        if (aiResult != null && !aiResult.isBlank()) {
            AiResponse resp = new AiResponse(aiResult);
            resp.setSuggestions(List.of("Define quantified performance KPIs", "Establish automated CI/CD pipeline", "Specify database indexing & caching strategy"));
            return resp;
        }

        // Deterministic Fallback
        String refined = "### Refined Project Specification & Proposal\n\n" +
                "**Executive Summary:**\n" +
                originalProposal + "\n\n" +
                "**Technical Objectives & Architecture:**\n" +
                "- Implement modular RESTful APIs with stateless JWT authentication and role-based access controls.\n" +
                "- Architect transactional data persistence ensuring relational integrity and foreign-key isolation.\n" +
                "- Deliver a responsive, component-driven client user experience with optimistic status updates.\n\n" +
                "**Recommended Sprint Milestones:**\n" +
                "1. *Sprint 1:* Data schema modeling, entity mapping, and automated integration test harness.\n" +
                "2. *Sprint 2:* Core collaboration workflows (team rosters, application review, status transitions).\n" +
                "3. *Sprint 3:* Deterministic matching heuristics and candidate recommendation algorithms.\n" +
                "4. *Sprint 4:* Containerized Docker deployment and end-to-end acceptance verification.";

        AiResponse resp = new AiResponse(refined);
        resp.setSuggestions(List.of("Add API load-testing benchmarks", "Implement circuit breaker for external calls", "Formalize team code review guidelines"));
        return resp;
    }

    public AiResponse analyzeSkillGaps(AiRequest request) {
        List<String> current = request.getCurrentSkills() != null ? request.getCurrentSkills() : List.of();
        List<String> required = request.getRequiredSkills() != null ? request.getRequiredSkills() : List.of();
        String targetRole = request.getTargetRole() != null ? request.getTargetRole() : "Full Stack Developer";

        Set<String> currentLower = new HashSet<>();
        for (String s : current) currentLower.add(s.toLowerCase().trim());

        List<String> missing = new ArrayList<>();
        for (String req : required) {
            if (!currentLower.contains(req.toLowerCase().trim())) {
                missing.add(req);
            }
        }

        String prompt = String.format(
                "A student has current skills: %s. The target project role '%s' requires: %s. Identified missing skills: %s. " +
                "Provide an accelerated 4-week learning path and concrete project deliverables to bridge this gap.",
                current, targetRole, required, missing
        );

        String aiResult = callLlm(prompt);
        if (aiResult != null && !aiResult.isBlank()) {
            AiResponse resp = new AiResponse(aiResult);
            resp.setSuggestions(missing);
            resp.setLearningResources(List.of("Official Documentation Guides", "GitHub Hands-On Labs", "Interactive Coding Katas"));
            return resp;
        }

        StringBuilder analysis = new StringBuilder();
        analysis.append(String.format("### Skill Gap Analysis for Target Role: %s\n\n", targetRole));
        if (missing.isEmpty()) {
            analysis.append("Congratulations! Your current skill portfolio satisfies all specified prerequisites. Recommended next step: Deepen testing, architecture patterns, and DevOps automation.\n");
        } else {
            analysis.append(String.format("**Key Competency Gaps Identified:** %s\n\n", String.join(", ", missing)));
            analysis.append("**4-Week Fast-Track Learning Pathway:**\n");
            int week = 1;
            for (String gap : missing) {
                analysis.append(String.format("- **Week %d (%s):** Fundamentals, syntax essentials, and core ecosystem libraries.\n", week++, gap));
                if (week > 4) break;
            }
            analysis.append("\n**Recommended Practical Exercise:** Build a focused micro-service incorporating these gaps into your capstone portfolio.");
        }

        AiResponse resp = new AiResponse(analysis.toString());
        resp.setSuggestions(missing);
        resp.setLearningResources(List.of("Spring Boot Guides (spring.io)", "React Official Docs (react.dev)", "Docker Get Started Handbook"));
        return resp;
    }

    public AiResponse chat(AiRequest request) {
        String prompt = request.getPrompt() != null ? request.getPrompt().trim() : "";
        if (prompt.isBlank()) {
            return new AiResponse("Hello! I am your ProjectMatch AI Assistant. How can I help you with project formation, team roles, or skill planning today?");
        }

        String aiResult = callLlm("You are ProjectMatch AI, an advisor helping university students form well-balanced software capstone teams and write excellent project proposals. Answer concisely:\n\n" + prompt);
        if (aiResult != null && !aiResult.isBlank()) {
            return new AiResponse(aiResult);
        }

        // Conversational Fallback
        return new AiResponse("ProjectMatch AI Advisor: For best results in student team formation, balance your team across frontend UI, backend API services, data persistence, and testing. Make sure to agree on meeting cadences and weekly hours up front!");
    }

    private String callLlm(String promptText) {
        if (apiKey == null || apiKey.isBlank()) {
            return null; // Gracefully fall back to deterministic responses
        }

        try {
            // Google Gemini API endpoint
            String url = String.format("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s", modelName, apiKey);

            Map<String, Object> textPart = Map.of("text", promptText);
            Map<String, Object> content = Map.of("parts", List.of(textPart));
            Map<String, Object> payload = Map.of("contents", List.of(content));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode candidates = root.path("candidates");
                if (candidates.isArray() && candidates.size() > 0) {
                    JsonNode textNode = candidates.get(0).path("content").path("parts").get(0).path("text");
                    if (!textNode.isMissingNode()) {
                        return textNode.asText();
                    }
                }
            }
        } catch (Exception ex) {
            log.warn("External LLM API call encountered an issue (falling back to deterministic AI model): {}", ex.getMessage());
        }

        return null;
    }
}
