package com.sale_oto.carshop.config;

import com.sale_oto.carshop.security.CustomAccessDeniedHandler;
import com.sale_oto.carshop.security.JwtAuthenticationEntryPoint;
import com.sale_oto.carshop.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final CustomAccessDeniedHandler accessDeniedHandler;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(exceptions -> exceptions
                    .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                    .accessDeniedHandler(accessDeniedHandler)
            )
            .authorizeHttpRequests(auth -> auth
                    // Public - Authentication
                    .requestMatchers("/api/auth/**").permitAll()

                    // Public - Xem sản phẩm (GET only)
                    .requestMatchers(HttpMethod.GET, "/api/oto/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/phu-kien/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/dich-vu/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/danh-gia/**").permitAll()

                    // Admin only
                    .requestMatchers("/api/nhan-vien/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/oto/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/phu-kien/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/dich-vu/**").hasRole("ADMIN")

                    // Admin + Nhân viên
                    .requestMatchers(HttpMethod.POST, "/api/oto/**").hasAnyRole("ADMIN", "NHAN_VIEN")
                    .requestMatchers(HttpMethod.PUT, "/api/oto/**").hasAnyRole("ADMIN", "NHAN_VIEN")
                    .requestMatchers(HttpMethod.PATCH, "/api/oto/**").hasAnyRole("ADMIN", "NHAN_VIEN")
                    .requestMatchers(HttpMethod.POST, "/api/phu-kien/**").hasAnyRole("ADMIN", "NHAN_VIEN")
                    .requestMatchers(HttpMethod.PUT, "/api/phu-kien/**").hasAnyRole("ADMIN", "NHAN_VIEN")
                    .requestMatchers(HttpMethod.POST, "/api/dich-vu/**").hasAnyRole("ADMIN", "NHAN_VIEN")
                    .requestMatchers(HttpMethod.PUT, "/api/dich-vu/**").hasAnyRole("ADMIN", "NHAN_VIEN")

                    // Đơn hàng - Admin/NV xem tất cả, KH xem đơn của mình
                    .requestMatchers(HttpMethod.GET, "/api/don-hang").hasAnyRole("ADMIN", "NHAN_VIEN")
                    .requestMatchers(HttpMethod.PATCH, "/api/don-hang/*/trang-thai").hasAnyRole("ADMIN", "NHAN_VIEN")
                    .requestMatchers(HttpMethod.PATCH, "/api/don-hang/*/gan-nhan-vien/*").hasAnyRole("ADMIN", "NHAN_VIEN")

                    // Khiếu nại - Admin/NV quản lý
                    .requestMatchers(HttpMethod.GET, "/api/khieu-nai").hasAnyRole("ADMIN", "NHAN_VIEN")
                    .requestMatchers(HttpMethod.PATCH, "/api/khieu-nai/**").hasAnyRole("ADMIN", "NHAN_VIEN")

                    // Quản lý KH - Admin only
                    .requestMatchers("/api/nguoi-dung/khach-hang/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PATCH, "/api/nguoi-dung/*/trang-thai").hasRole("ADMIN")

                    // Tất cả request còn lại cần authentication
                    .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
