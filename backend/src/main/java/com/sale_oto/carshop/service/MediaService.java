package com.sale_oto.carshop.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.sale_oto.carshop.dto.response.MediaResponse;
import com.sale_oto.carshop.entity.Media;
import com.sale_oto.carshop.enums.LoaiDoiTuong;
import com.sale_oto.carshop.enums.LoaiMedia;
import com.sale_oto.carshop.exception.BadRequestException;
import com.sale_oto.carshop.exception.ResourceNotFoundException;
import com.sale_oto.carshop.repository.MediaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class MediaService {

    private final Cloudinary cloudinary;
    private final MediaRepository mediaRepository;

    private static final long MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final long MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

    @Transactional
    public MediaResponse upload(MultipartFile file, LoaiDoiTuong loaiDoiTuong, Long doiTuongId,
                                String moTa, Integer thuTu) {
        validateFile(file);

        LoaiMedia loaiMedia = detectMediaType(file);
        String folder = "carshop/" + loaiDoiTuong.name().toLowerCase() + "/" + doiTuongId;

        try {
            Map<String, Object> uploadParams = ObjectUtils.asMap(
                    "folder", folder,
                    "resource_type", loaiMedia == LoaiMedia.VIDEO ? "video" : "image",
                    "overwrite", false
            );

            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.uploader().upload(file.getBytes(), uploadParams);

            Media media = Media.builder()
                    .loaiMedia(loaiMedia)
                    .loaiDoiTuong(loaiDoiTuong)
                    .doiTuongId(doiTuongId)
                    .url((String) result.get("secure_url"))
                    .publicId((String) result.get("public_id"))
                    .moTa(moTa)
                    .thuTu(thuTu != null ? thuTu : 0)
                    .dungLuong(file.getSize())
                    .dinhDang((String) result.get("format"))
                    .chieuRong(toInteger(result.get("width")))
                    .chieuCao(toInteger(result.get("height")))
                    .thoiLuong(toDouble(result.get("duration")))
                    .build();

            media = mediaRepository.save(media);
            return toResponse(media);

        } catch (IOException e) {
            log.error("Upload Cloudinary thất bại: {}", e.getMessage());
            throw new BadRequestException("Upload file thất bại: " + e.getMessage());
        }
    }

    @Transactional
    public List<MediaResponse> uploadMultiple(List<MultipartFile> files, LoaiDoiTuong loaiDoiTuong,
                                              Long doiTuongId, String moTa) {
        return files.stream()
                .map(file -> {
                    int thuTu = (int) mediaRepository.countByLoaiDoiTuongAndDoiTuongId(loaiDoiTuong, doiTuongId);
                    return upload(file, loaiDoiTuong, doiTuongId, moTa, thuTu);
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MediaResponse> getByDoiTuong(LoaiDoiTuong loaiDoiTuong, Long doiTuongId) {
        return mediaRepository.findByLoaiDoiTuongAndDoiTuongIdOrderByThuTuAsc(loaiDoiTuong, doiTuongId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<MediaResponse> getByDoiTuongAndLoaiMedia(LoaiDoiTuong loaiDoiTuong, Long doiTuongId,
                                                         LoaiMedia loaiMedia) {
        return mediaRepository.findByLoaiDoiTuongAndDoiTuongIdAndLoaiMediaOrderByThuTuAsc(
                loaiDoiTuong, doiTuongId, loaiMedia)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public void delete(Long mediaId) {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new ResourceNotFoundException("Media", mediaId));

        deleteFromCloudinary(media);
        mediaRepository.delete(media);
    }

    @Transactional
    public void deleteAllByDoiTuong(LoaiDoiTuong loaiDoiTuong, Long doiTuongId) {
        List<Media> mediaList = mediaRepository.findByLoaiDoiTuongAndDoiTuongIdOrderByThuTuAsc(
                loaiDoiTuong, doiTuongId);
        mediaList.forEach(this::deleteFromCloudinary);
        mediaRepository.deleteByLoaiDoiTuongAndDoiTuongId(loaiDoiTuong, doiTuongId);
    }

    private void deleteFromCloudinary(Media media) {
        try {
            String resourceType = media.getLoaiMedia() == LoaiMedia.VIDEO ? "video" : "image";
            cloudinary.uploader().destroy(media.getPublicId(), ObjectUtils.asMap("resource_type", resourceType));
        } catch (IOException e) {
            log.error("Xóa Cloudinary thất bại (publicId={}): {}", media.getPublicId(), e.getMessage());
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File không được để trống");
        }

        String contentType = file.getContentType();
        if (contentType == null) {
            throw new BadRequestException("Không xác định được loại file");
        }

        boolean isImage = contentType.startsWith("image/");
        boolean isVideo = contentType.startsWith("video/");

        if (!isImage && !isVideo) {
            throw new BadRequestException("Chỉ hỗ trợ file ảnh (image) hoặc video");
        }

        if (isImage && file.getSize() > MAX_IMAGE_SIZE) {
            throw new BadRequestException("Ảnh không được vượt quá 10MB");
        }

        if (isVideo && file.getSize() > MAX_VIDEO_SIZE) {
            throw new BadRequestException("Video không được vượt quá 100MB");
        }
    }

    private LoaiMedia detectMediaType(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType != null && contentType.startsWith("video/")) {
            return LoaiMedia.VIDEO;
        }
        return LoaiMedia.IMAGE;
    }

    private Integer toInteger(Object value) {
        if (value == null) return null;
        if (value instanceof Number n) return n.intValue();
        return null;
    }

    private Double toDouble(Object value) {
        if (value == null) return null;
        if (value instanceof Number n) return n.doubleValue();
        return null;
    }

    private MediaResponse toResponse(Media media) {
        return MediaResponse.builder()
                .id(media.getId())
                .loaiMedia(media.getLoaiMedia())
                .loaiDoiTuong(media.getLoaiDoiTuong())
                .doiTuongId(media.getDoiTuongId())
                .url(media.getUrl())
                .moTa(media.getMoTa())
                .thuTu(media.getThuTu())
                .dungLuong(media.getDungLuong())
                .dinhDang(media.getDinhDang())
                .chieuRong(media.getChieuRong())
                .chieuCao(media.getChieuCao())
                .thoiLuong(media.getThoiLuong())
                .ngayTao(media.getNgayTao())
                .build();
    }
}
