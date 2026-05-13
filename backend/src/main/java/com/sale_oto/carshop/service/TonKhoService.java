package com.sale_oto.carshop.service;

import com.sale_oto.carshop.dto.request.TonKhoRequest;
import com.sale_oto.carshop.dto.response.TonKhoResponse;
import com.sale_oto.carshop.entity.KhoHang;
import com.sale_oto.carshop.entity.OTo;
import com.sale_oto.carshop.entity.PhuKien;
import com.sale_oto.carshop.entity.TonKho;
import com.sale_oto.carshop.exception.BadRequestException;
import com.sale_oto.carshop.exception.ResourceNotFoundException;
import com.sale_oto.carshop.repository.KhoHangRepository;
import com.sale_oto.carshop.repository.OToRepository;
import com.sale_oto.carshop.repository.PhuKienRepository;
import com.sale_oto.carshop.repository.TonKhoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TonKhoService {

    private final TonKhoRepository tonKhoRepository;
    private final OToRepository oToRepository;
    private final PhuKienRepository phuKienRepository;
    private final KhoHangRepository khoHangRepository;

    /**
     * Lấy tồn kho của 1 xe ở TẤT CẢ kho đang hoạt động.
     */
    @Transactional(readOnly = true)
    public List<TonKhoResponse> getByOtoId(Long otoId) {
        if (!oToRepository.existsById(otoId)) {
            throw new ResourceNotFoundException("Ô tô", otoId);
        }

        List<KhoHang> activeKhos = khoHangRepository.findByTrangThai(true);
        Map<Long, TonKho> tonKhoMap = tonKhoRepository.findByOtoId(otoId)
                .stream()
                .collect(Collectors.toMap(tk -> tk.getKhoHang().getId(), tk -> tk, (t1, t2) -> t1));

        return activeKhos.stream().map(kho -> {
            TonKho tk = tonKhoMap.get(kho.getId());
            return TonKhoResponse.builder()
                    .id(tk != null ? tk.getId() : null)
                    .khoHangId(kho.getId())
                    .tenKho(kho.getTenKho())
                    .diaChiChiTiet(kho.getDiaChiChiTiet())
                    .tinhThanhTen(kho.getTinhThanhTen())
                    .khoTrangThai(kho.getTrangThai())
                    .otoId(otoId)
                    .phuKienId(null)
                    .soLuong(tk != null ? tk.getSoLuong() : 0)
                    .build();
        }).toList();
    }

    /**
     * Lấy tồn kho của 1 phụ kiện ở TẤT CẢ kho đang hoạt động.
     */
    @Transactional(readOnly = true)
    public List<TonKhoResponse> getByPhuKienId(Long phuKienId) {
        if (!phuKienRepository.existsById(phuKienId)) {
            throw new ResourceNotFoundException("Phụ kiện", phuKienId);
        }

        List<KhoHang> activeKhos = khoHangRepository.findByTrangThai(true);
        Map<Long, TonKho> tonKhoMap = tonKhoRepository.findByPhuKienId(phuKienId)
                .stream()
                .collect(Collectors.toMap(tk -> tk.getKhoHang().getId(), tk -> tk, (t1, t2) -> t1));

        return activeKhos.stream().map(kho -> {
            TonKho tk = tonKhoMap.get(kho.getId());
            return TonKhoResponse.builder()
                    .id(tk != null ? tk.getId() : null)
                    .khoHangId(kho.getId())
                    .tenKho(kho.getTenKho())
                    .diaChiChiTiet(kho.getDiaChiChiTiet())
                    .tinhThanhTen(kho.getTinhThanhTen())
                    .khoTrangThai(kho.getTrangThai())
                    .otoId(null)
                    .phuKienId(phuKienId)
                    .soLuong(tk != null ? tk.getSoLuong() : 0)
                    .build();
        }).toList();
    }

    @Transactional
    public TonKhoResponse upsert(TonKhoRequest request) {
        KhoHang kho = khoHangRepository.findById(request.getKhoHangId())
                .orElseThrow(() -> new ResourceNotFoundException("Kho hàng", request.getKhoHangId()));

        if (request.getOtoId() != null) {
            OTo oto = oToRepository.findById(request.getOtoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Ô tô", request.getOtoId()));

            TonKho tonKho = tonKhoRepository.findByOtoIdAndKhoHangId(request.getOtoId(), request.getKhoHangId())
                    .orElseGet(() -> TonKho.builder().oto(oto).khoHang(kho).build());

            tonKho.setSoLuong(request.getSoLuong());
            tonKho = tonKhoRepository.save(tonKho);
            syncOtoTotalStock(oto.getId());
            return toResponse(tonKho);

        } else if (request.getPhuKienId() != null) {
            PhuKien phuKien = phuKienRepository.findById(request.getPhuKienId())
                    .orElseThrow(() -> new ResourceNotFoundException("Phụ kiện", request.getPhuKienId()));

            TonKho tonKho = tonKhoRepository.findByPhuKienIdAndKhoHangId(request.getPhuKienId(), request.getKhoHangId())
                    .orElseGet(() -> TonKho.builder().phuKien(phuKien).khoHang(kho).build());

            tonKho.setSoLuong(request.getSoLuong());
            tonKho = tonKhoRepository.save(tonKho);
            syncPhuKienTotalStock(phuKien.getId());
            return toResponse(tonKho);

        } else {
            throw new BadRequestException("Phải cung cấp otoId hoặc phuKienId");
        }
    }

    /**
     * Trừ tồn kho khi đặt hàng thành công.
     */
    @Transactional
    public void decreaseStock(Long otoId, Long phuKienId, Long khoHangId, int quantity) {
        if (khoHangId == null) return; // Nếu không có kho thì bỏ qua

        if (otoId != null) {
            TonKho tonKho = tonKhoRepository.findByOtoIdAndKhoHangId(otoId, khoHangId)
                    .orElseThrow(() -> new BadRequestException("Không tìm thấy tồn kho xe ID=" + otoId + " tại kho ID=" + khoHangId));

            if (tonKho.getSoLuong() < quantity) {
                throw new BadRequestException("Kho '" + tonKho.getKhoHang().getTenKho() + "' chỉ còn " + tonKho.getSoLuong() + " xe");
            }

            tonKho.setSoLuong(tonKho.getSoLuong() - quantity);
            tonKhoRepository.save(tonKho);
            syncOtoTotalStock(otoId);

        } else if (phuKienId != null) {
            TonKho tonKho = tonKhoRepository.findByPhuKienIdAndKhoHangId(phuKienId, khoHangId)
                    .orElseThrow(() -> new BadRequestException("Không tìm thấy tồn kho phụ kiện ID=" + phuKienId + " tại kho ID=" + khoHangId));

            if (tonKho.getSoLuong() < quantity) {
                throw new BadRequestException("Kho '" + tonKho.getKhoHang().getTenKho() + "' chỉ còn " + tonKho.getSoLuong() + " phụ kiện");
            }

            tonKho.setSoLuong(tonKho.getSoLuong() - quantity);
            tonKhoRepository.save(tonKho);
            syncPhuKienTotalStock(phuKienId);
        }
    }

    /**
     * Hoàn kho khi hủy đơn.
     */
    @Transactional
    public void increaseStock(Long otoId, Long phuKienId, Long khoHangId, int quantity) {
        if (khoHangId == null) return;

        KhoHang kho = khoHangRepository.findById(khoHangId)
                .orElseThrow(() -> new ResourceNotFoundException("Kho hàng", khoHangId));

        if (otoId != null) {
            TonKho tonKho = tonKhoRepository.findByOtoIdAndKhoHangId(otoId, khoHangId)
                    .orElseGet(() -> {
                        OTo oto = oToRepository.findById(otoId).orElseThrow(() -> new ResourceNotFoundException("Ô tô", otoId));
                        return TonKho.builder().oto(oto).khoHang(kho).soLuong(0).build();
                    });

            tonKho.setSoLuong(tonKho.getSoLuong() + quantity);
            tonKhoRepository.save(tonKho);
            syncOtoTotalStock(otoId);

        } else if (phuKienId != null) {
            TonKho tonKho = tonKhoRepository.findByPhuKienIdAndKhoHangId(phuKienId, khoHangId)
                    .orElseGet(() -> {
                        PhuKien phuKien = phuKienRepository.findById(phuKienId).orElseThrow(() -> new ResourceNotFoundException("Phụ kiện", phuKienId));
                        return TonKho.builder().phuKien(phuKien).khoHang(kho).soLuong(0).build();
                    });

            tonKho.setSoLuong(tonKho.getSoLuong() + quantity);
            tonKhoRepository.save(tonKho);
            syncPhuKienTotalStock(phuKienId);
        }
    }

    /**
     * Đồng bộ OTo.soLuong = SUM(TonKho.soLuong) trên tất cả kho.
     */
    private void syncOtoTotalStock(Long otoId) {
        int total = tonKhoRepository.findByOtoId(otoId).stream()
                .mapToInt(TonKho::getSoLuong).sum();
        OTo oto = oToRepository.findById(otoId).orElse(null);
        if (oto != null) {
            oto.setSoLuong(total);
            oToRepository.save(oto);
        }
    }

    /**
     * Đồng bộ PhuKien.soLuong = SUM(TonKho.soLuong) trên tất cả kho.
     */
    private void syncPhuKienTotalStock(Long phuKienId) {
        int total = tonKhoRepository.findByPhuKienId(phuKienId).stream()
                .mapToInt(TonKho::getSoLuong).sum();
        PhuKien phuKien = phuKienRepository.findById(phuKienId).orElse(null);
        if (phuKien != null) {
            phuKien.setSoLuong(total);
            phuKienRepository.save(phuKien);
        }
    }

    private TonKhoResponse toResponse(TonKho tk) {
        return TonKhoResponse.builder()
                .id(tk.getId())
                .khoHangId(tk.getKhoHang().getId())
                .tenKho(tk.getKhoHang().getTenKho())
                .diaChiChiTiet(tk.getKhoHang().getDiaChiChiTiet())
                .tinhThanhTen(tk.getKhoHang().getTinhThanhTen())
                .khoTrangThai(tk.getKhoHang().getTrangThai())
                .otoId(tk.getOto() != null ? tk.getOto().getId() : null)
                .phuKienId(tk.getPhuKien() != null ? tk.getPhuKien().getId() : null)
                .soLuong(tk.getSoLuong())
                .build();
    }
}
