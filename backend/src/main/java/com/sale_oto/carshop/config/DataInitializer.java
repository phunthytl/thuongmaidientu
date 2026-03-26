package com.sale_oto.carshop.config;

import com.sale_oto.carshop.entity.NguoiDung;
import com.sale_oto.carshop.enums.VaiTro;
import com.sale_oto.carshop.repository.NguoiDungRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final NguoiDungRepository nguoiDungRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (nguoiDungRepository.findByEmail("admin@carshop.com").isEmpty()) {
            NguoiDung admin = new NguoiDung();
            admin.setHoTen("Admin");
            admin.setEmail("admin@carshop.com");
            admin.setMatKhau(passwordEncoder.encode("admin123"));
            admin.setVaiTro(VaiTro.ADMIN);
            admin.setTrangThai(true);
            nguoiDungRepository.save(admin);
            log.info("=== Tạo tài khoản Admin mặc định: admin@carshop.com / admin123 ===");
        }
    }
}
