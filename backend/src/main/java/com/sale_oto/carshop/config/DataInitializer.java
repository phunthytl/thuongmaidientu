package com.sale_oto.carshop.config;

import com.sale_oto.carshop.entity.NguoiDung;
import com.sale_oto.carshop.entity.OTo;
import com.sale_oto.carshop.enums.TrangThaiOTo;
import com.sale_oto.carshop.enums.VaiTro;
import com.sale_oto.carshop.repository.NguoiDungRepository;
import com.sale_oto.carshop.repository.OToRepository;
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
    private final OToRepository oToRepository;
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

        // Seed data cho Ô tô nếu chưa có
        if (oToRepository.count() == 0) {
            OTo car1 = new OTo();
            car1.setTenXe("Toyota Camry 2.5Q");
            car1.setHangXe("Toyota");
            car1.setDongXe("Camry");
            car1.setNamSanXuat(2023);
            car1.setGia(new java.math.BigDecimal("1400000000"));
            car1.setSoLuong(5);
            car1.setTrangThai(TrangThaiOTo.DANG_BAN);
            car1.setMoTa("Xe sedan hạng D sang trọng, nhập khẩu Thái Lan.");
            oToRepository.save(car1);

            OTo car2 = new OTo();
            car2.setTenXe("Honda CR-V L");
            car2.setHangXe("Honda");
            car2.setDongXe("CR-V");
            car2.setNamSanXuat(2024);
            car2.setGia(new java.math.BigDecimal("1100000000"));
            car2.setSoLuong(3);
            car2.setTrangThai(TrangThaiOTo.DANG_BAN);
            car2.setMoTa("Mẫu Crossover 7 chỗ đa dụng, công nghệ Honda Sensing.");
            oToRepository.save(car2);

            log.info("=== Đã tạo dữ liệu mẫu cho Ô tô (Seed Data) ===");
        }
    }
}
