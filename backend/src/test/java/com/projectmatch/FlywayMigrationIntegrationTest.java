package com.projectmatch;

import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.MigrationInfo;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class FlywayMigrationIntegrationTest {

    @Autowired
    private Flyway flyway;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    @DisplayName("Flyway applies V1 migration successfully and reaches version 1")
    void flywayAppliesV1MigrationSuccessfully() {
        MigrationInfo current = flyway.info().current();
        assertThat(current).isNotNull();
        assertThat(current.getVersion().getVersion()).isEqualTo("1");
        assertThat(current.getDescription()).isEqualTo("initial schema");
        assertThat(current.getState().isApplied()).isTrue();
    }

    @Test
    @DisplayName("All expected entities and collection tables exist in database")
    void allExpectedTablesExist() {
        List<String> expectedTables = List.of(
                "USERS",
                "STUDENT_PROFILES",
                "STUDENT_PREFERRED_ROLES",
                "STUDENT_INTERESTS",
                "SKILLS",
                "STUDENT_SKILLS",
                "PROJECTS",
                "PROJECT_OPEN_ROLES",
                "PROJECT_TAGS",
                "PROJECT_SKILLS",
                "TEAMS",
                "TEAM_MEMBERS",
                "TASKS",
                "INVITATIONS",
                "FLYWAY_SCHEMA_HISTORY"
        );

        List<String> actualTables = jdbcTemplate.queryForList(
                "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'PUBLIC'",
                String.class
        ).stream().map(String::toUpperCase).toList();

        for (String table : expectedTables) {
            assertThat(actualTables)
                    .as("Table %s should exist in schema", table)
                    .contains(table);
        }
    }

    @Test
    @DisplayName("Repeated Flyway migration does not reapply already applied migrations")
    void repeatedMigrationIsIdempotent() {
        int applied = flyway.migrate().migrationsExecuted;
        assertThat(applied)
                .as("No additional migrations should be applied on second run")
                .isEqualTo(0);

        MigrationInfo current = flyway.info().current();
        assertThat(current.getVersion().getVersion()).isEqualTo("1");
    }
}
