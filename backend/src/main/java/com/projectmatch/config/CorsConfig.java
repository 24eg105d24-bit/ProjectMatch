package com.projectmatch.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * CORS configuration.
 *
 * <p>The {@link CorsConfigurationSource} bean is the single authoritative source for CORS policy.
 * Spring Security picks it up automatically via {@code cors(Customizer.withDefaults())} in
 * {@link SecurityConfig}. The {@code addCorsMappings} WebMvcConfigurer approach is intentionally
 * not used here to avoid two competing CORS filters that can interfere with each other.
 *
 * <p>Allowed origins are driven by the {@code CORS_ALLOWED_ORIGINS} environment variable.
 * When that variable is absent the default includes localhost dev ports, the production Vercel
 * deployment, and a wildcard for all {@code *.vercel.app} preview deployments.
 */
@Configuration
public class CorsConfig {

    @Value("${cors.allowed-origins:" +
            "http://localhost:5173," +
            "http://localhost:3000," +
            "http://localhost," +
            "https://project-match-neon.vercel.app," +
            "https://*.vercel.app}")
    private String allowedOriginsConfig;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        List<String> origins = Arrays.stream(allowedOriginsConfig.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        configuration.setAllowedOriginPatterns(origins);
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
