package com.sale_oto.carshop.controller;

import com.sale_oto.carshop.dto.response.ApiResponse;
import com.sale_oto.carshop.dto.response.KhachHangResponse;
import com.sale_oto.carshop.dto.response.NguoiDungResponse;
import com.sale_oto.carshop.service.NguoiDungService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/nguoi-dung")
@RequiredArgsConstructor
public class NguoiDungController {

    private final NguoiDungService nguoiDungService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NguoiDungResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(nguoiDungService.getById(id)));
    }

    @GetMapping("/khach-hang")
    public ResponseEntity<ApiResponse<Page<KhachHangResponse>>> getAllKhachHang(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(nguoiDungService.getAllKhachHang(pageable)));
    }

    @GetMapping("/khach-hang/tim-kiem")
    public ResponseEntity<ApiResponse<Page<KhachHangResponse>>> searchKhachHang(
            @RequestParam String keyword, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(nguoiDungService.searchKhachHang(keyword, pageable)));
    }

    @PatchMapping("/{id}/trang-thai")
    public ResponseEntity<ApiResponse<NguoiDungResponse>> capNhatTrangThai(
            @PathVariable Long id, @RequestParam Boolean trangThai) {
        return ResponseEntity.ok(ApiResponse.success(nguoiDungService.capNhatTrangThai(id, trangThai)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NguoiDungResponse>> capNhatThongTin(
            @PathVariable Long id, @RequestBody @jakarta.validation.Valid com.sale_oto.carshop.dto.request.CapNhatThongTinRequest request) {
        return ResponseEntity.ok(ApiResponse.success(nguoiDungService.capNhatThongTin(id, request)));
    }

    @PutMapping("/{id}/mat-khau")
    public ResponseEntity<ApiResponse<Void>> doiMatKhau(
            @PathVariable Long id, @RequestBody @jakarta.validation.Valid com.sale_oto.carshop.dto.request.DoiMatKhauRequest request) {
        nguoiDungService.doiMatKhau(id, request);
        return ResponseEntity.ok(ApiResponse.success("Đổi mật khẩu thành công", null));
    }
}
