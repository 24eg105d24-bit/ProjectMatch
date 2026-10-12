package com.projectmatch.service;

import com.projectmatch.dto.response.SkillResponse;
import com.projectmatch.entity.Skill;
import com.projectmatch.repository.SkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @Transactional(readOnly = true)
    public List<SkillResponse> getAllSkills() {
        return skillRepository.findAll().stream()
                .map(s -> new SkillResponse(s.getId(), s.getName(), s.getCategory(), null, null))
                .toList();
    }

    @Transactional
    public Skill getOrCreateSkill(String name, String category) {
        String trimmedName = name.trim();
        return skillRepository.findByNameIgnoreCase(trimmedName)
                .orElseGet(() -> skillRepository.save(new Skill(trimmedName, category != null ? category : "General")));
    }
}
