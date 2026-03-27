package com.sale_oto.carshop.controller;

import com.sale_oto.carshop.dto.response.ApiResponse;
import com.sale_oto.carshop.dto.response.MediaResponse;
import com.sale_oto.carshop.enums.LoaiDoiTuong;
import com.sale_oto.carshop.enums.LoaiMedia;
import com.sale_oto.carshop.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<MediaResponse>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("loaiDoiTuong") LoaiDoiTuong loaiDoiTuong,
            @RequestParam("doiTuongId") Long doiTuongId,
            @RequestParam(value = "moTa", required = false) String moTa,
            @RequestParam(value = "thuTu", required = false) Integer thuTu) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(mediaService.upload(file, loaiDoiTuong, doiTuongId, moTa, thuTu)));
    }

    @PostMapping(value = "/upload-multiple", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<List<MediaResponse>>> uploadMultiple(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("loaiDoiTuong") LoaiDoiTuong loaiDoiTuong,
            @RequestParam("doiTuongId") Long doiTuongId,
            @RequestParam(value = "moTa", required = false) String moTa) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(mediaService.uploadMultiple(files, loaiDoiTuong, doiTuongId, moTa)));
    }

    @GetMapping("/{loaiDoiTuong}/{doiTuongId}")
    public ResponseEntity<ApiResponse<List<MediaResponse>>> getByDoiTuong(
            @PathVariable LoaiDoiTuong loaiDoiTuong,
            @PathVariable Long doiTuongId) {

        return ResponseEntity.ok(ApiResponse.success(mediaService.getByDoiTuong(loaiDoiTuong, doiTuongId)));
    }

    @GetMapping("/{loaiDoiTuong}/{doiTuongId}/images")
    public ResponseEntity<ApiResponse<List<MediaResponse>>> getImages(
            @PathVariable LoaiDoiTuong loaiDoiTuong,
            @PathVariable Long doiTuongId) {

        return ResponseEntity.ok(ApiResponse.success(
                mediaService.getByDoiTuongAndLoaiMedia(loaiDoiTuong, doiTuongId, LoaiMedia.IMAGE)));
    }

    @GetMapping("/{loaiDoiTuong}/{doiTuongId}/videos")
    public ResponseEntity<ApiResponse<List<MediaResponse>>> getVideos(
            @PathVariable LoaiDoiTuong loaiDoiTuong,
            @PathVariable Long doiTuongId) {

        return ResponseEntity.ok(ApiResponse.success(
                mediaService.getByDoiTuongAndLoaiMedia(loaiDoiTuong, doiTuongId, LoaiMedia.VIDEO)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        mediaService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa media thành công", null));
    }

    @DeleteMapping("/{loaiDoiTuong}/{doiTuongId}")
    public ResponseEntity<ApiResponse<Void>> deleteAll(
            @PathVariable LoaiDoiTuong loaiDoiTuong,
            @PathVariable Long doiTuongId) {

        mediaService.deleteAllByDoiTuong(loaiDoiTuong, doiTuongId);
        return ResponseEntity.ok(ApiResponse.success("Xóa tất cả media thành công", null));
    }
}
