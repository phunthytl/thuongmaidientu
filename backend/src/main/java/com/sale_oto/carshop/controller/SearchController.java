package com.sale_oto.carshop.controller;

import com.sale_oto.carshop.dto.response.ApiResponse;
import com.sale_oto.carshop.dto.response.SearchSuggestionResponse;
import com.sale_oto.carshop.enums.TrangThaiOTo;
import com.sale_oto.carshop.repository.DichVuRepository;
import com.sale_oto.carshop.repository.OToRepository;
import com.sale_oto.carshop.repository.PhuKienRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@org.springframework.web.bind.annotation.CrossOrigin("*")
public class SearchController {

    private final OToRepository oToRepository;
    private final PhuKienRepository phuKienRepository;
    private final DichVuRepository dichVuRepository;
    private final com.sale_oto.carshop.repository.MediaRepository mediaRepository;

    private String getFirstImage(com.sale_oto.carshop.enums.LoaiDoiTuong loai, Long id) {
        return mediaRepository.findByLoaiDoiTuongAndDoiTuongIdAndLoaiMediaOrderByThuTuAsc(
                loai, id, com.sale_oto.carshop.enums.LoaiMedia.IMAGE)
                .stream()
                .findFirst()
                .map(m -> m.getUrl())
                .orElse(null);
    }

    @GetMapping("/suggestions")
    public ResponseEntity<ApiResponse<List<SearchSuggestionResponse>>> getSuggestions(@RequestParam String keyword) {
        if (keyword == null || keyword.trim().length() < 2) {
            return ResponseEntity.ok(ApiResponse.success(new ArrayList<>()));
        }

        List<SearchSuggestionResponse> suggestions = new ArrayList<>();

        // Search OTo
        suggestions.addAll(oToRepository.search(keyword, TrangThaiOTo.DANG_BAN, PageRequest.of(0, 10))
                .getContent().stream()
                .map(o -> SearchSuggestionResponse.builder()
                        .id(o.getId().toString())
                        .name(o.getTenXe())
                        .type("OTO")
                        .url("/products/oto/" + o.getId())
                        .price(o.getGia())
                        .image(getFirstImage(com.sale_oto.carshop.enums.LoaiDoiTuong.OTO, o.getId()))
                        .build())
                .collect(Collectors.toList()));

        // Search PhuKien
        suggestions.addAll(phuKienRepository.search(keyword, PageRequest.of(0, 10))
                .getContent().stream()
                .map(p -> SearchSuggestionResponse.builder()
                        .id(p.getId().toString())
                        .name(p.getTenPhuKien())
                        .type("PHU_KIEN")
                        .url("/products/accessory/" + p.getId())
                        .price(p.getGia())
                        .image(getFirstImage(com.sale_oto.carshop.enums.LoaiDoiTuong.PHU_KIEN, p.getId()))
                        .build())
                .collect(Collectors.toList()));

        // Search DichVu
        suggestions.addAll(dichVuRepository.search(keyword, PageRequest.of(0, 10))
                .getContent().stream()
                .map(d -> SearchSuggestionResponse.builder()
                        .id(d.getId().toString())
                        .name(d.getTenDichVu())
                        .type("DICH_VU")
                        .url("/services/" + d.getId())
                        .price(d.getGia())
                        .image(getFirstImage(com.sale_oto.carshop.enums.LoaiDoiTuong.DICH_VU, d.getId()))
                        .build())
                .collect(Collectors.toList()));

        return ResponseEntity.ok(ApiResponse.success(suggestions));
    }
}
