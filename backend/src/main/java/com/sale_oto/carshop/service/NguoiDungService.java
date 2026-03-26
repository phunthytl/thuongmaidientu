package com.sale_oto.carshop.service;

import com.sale_oto.carshop.dto.request.DangKyRequest;
import com.sale_oto.carshop.dto.request.DangNhapRequest;
import com.sale_oto.carshop.dto.response.AuthResponse;
import com.sale_oto.carshop.dto.response.KhachHangResponse;
import com.sale_oto.carshop.dto.response.NguoiDungResponse;
import com.sale_oto.carshop.entity.KhachHang;
import com.sale_oto.carshop.entity.NguoiDung;
import com.sale_oto.carshop.enums.HangThanhVien;
import com.sale_oto.carshop.enums.VaiTro;
import com.sale_oto.carshop.exception.BadRequestException;
import com.sale_oto.carshop.exception.DuplicateResourceException;
import com.sale_oto.carshop.exception.ResourceNotFoundException;
import com.sale_oto.carshop.repository.KhachHangRepository;
import com.sale_oto.carshop.repository.NguoiDungRepository;
import com.sale_oto.carshop.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NguoiDungService {

    private final NguoiDungRepository nguoiDungRepository;
    private final KhachHangRepository khachHangRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse dangNhap(DangNhapRequest request) {
        NguoiDung nguoiDung = nguoiDungRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Email hoặc mật khẩu không đúng"));

        if (!passwordEncoder.matches(request.getMatKhau(), nguoiDung.getMatKhau())) {
            throw new BadRequestException("Email hoặc mật khẩu không đúng");
        }

        if (!nguoiDung.getTrangThai()) {
            throw new BadRequestException("Tài khoản đã bị khóa");
        }

        String accessToken = jwtTokenProvider.generateToken(
                nguoiDung.getId(), nguoiDung.getEmail(), nguoiDung.getVaiTro().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(nguoiDung.getEmail());

        return AuthResponse.of(accessToken, refreshToken, toNguoiDungResponse(nguoiDung));
    }

    @Transactional
    public AuthResponse dangKy(DangKyRequest request) {
        if (nguoiDungRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email đã tồn tại");
        }

        KhachHang khachHang = new KhachHang();
        khachHang.setHoTen(request.getHoTen());
        khachHang.setEmail(request.getEmail());
        khachHang.setMatKhau(passwordEncoder.encode(request.getMatKhau()));
        khachHang.setSoDienThoai(request.getSoDienThoai());
        khachHang.setDiaChi(request.getDiaChi());
        khachHang.setVaiTro(VaiTro.KHACH_HANG);
        khachHang.setTrangThai(true);
        khachHang.setDiemTichLuy(0);
        khachHang.setHangThanhVien(HangThanhVien.DONG);

        khachHang = khachHangRepository.save(khachHang);

        String accessToken = jwtTokenProvider.generateToken(
                khachHang.getId(), khachHang.getEmail(), khachHang.getVaiTro().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(khachHang.getEmail());

        return AuthResponse.of(accessToken, refreshToken, toNguoiDungResponse(khachHang));
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new BadRequestException("Refresh token không hợp lệ hoặc đã hết hạn");
        }

        String email = jwtTokenProvider.getEmailFromToken(refreshToken);
        NguoiDung nguoiDung = nguoiDungRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Người dùng không tồn tại"));

        String newAccessToken = jwtTokenProvider.generateToken(
                nguoiDung.getId(), nguoiDung.getEmail(), nguoiDung.getVaiTro().name());
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(nguoiDung.getEmail());

        return AuthResponse.of(newAccessToken, newRefreshToken, toNguoiDungResponse(nguoiDung));
    }

    public NguoiDungResponse getById(Long id) {
        NguoiDung nguoiDung = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", id));
        return toNguoiDungResponse(nguoiDung);
    }

    public Page<KhachHangResponse> getAllKhachHang(Pageable pageable) {
        return khachHangRepository.findAll(pageable).map(this::toKhachHangResponse);
    }

    public Page<KhachHangResponse> searchKhachHang(String keyword, Pageable pageable) {
        return khachHangRepository.search(keyword, pageable).map(this::toKhachHangResponse);
    }

    @Transactional
    public NguoiDungResponse capNhatTrangThai(Long id, Boolean trangThai) {
        NguoiDung nguoiDung = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", id));
        nguoiDung.setTrangThai(trangThai);
        nguoiDung = nguoiDungRepository.save(nguoiDung);
        return toNguoiDungResponse(nguoiDung);
    }

    public NguoiDungResponse toNguoiDungResponse(NguoiDung nguoiDung) {
        return NguoiDungResponse.builder()
                .id(nguoiDung.getId())
                .hoTen(nguoiDung.getHoTen())
                .email(nguoiDung.getEmail())
                .soDienThoai(nguoiDung.getSoDienThoai())
                .diaChi(nguoiDung.getDiaChi())
                .anhDaiDien(nguoiDung.getAnhDaiDien())
                .vaiTro(nguoiDung.getVaiTro())
                .trangThai(nguoiDung.getTrangThai())
                .ngayTao(nguoiDung.getNgayTao())
                .build();
    }

    private KhachHangResponse toKhachHangResponse(KhachHang khachHang) {
        return KhachHangResponse.builder()
                .id(khachHang.getId())
                .hoTen(khachHang.getHoTen())
                .email(khachHang.getEmail())
                .soDienThoai(khachHang.getSoDienThoai())
                .diaChi(khachHang.getDiaChi())
                .anhDaiDien(khachHang.getAnhDaiDien())
                .trangThai(khachHang.getTrangThai())
                .diemTichLuy(khachHang.getDiemTichLuy())
                .hangThanhVien(khachHang.getHangThanhVien())
                .ngayTao(khachHang.getNgayTao())
                .build();
    }
}
