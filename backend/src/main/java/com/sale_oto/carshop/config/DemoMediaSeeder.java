package com.sale_oto.carshop.config;

import com.sale_oto.carshop.entity.DichVu;
import com.sale_oto.carshop.entity.Media;
import com.sale_oto.carshop.enums.LoaiDoiTuong;
import com.sale_oto.carshop.enums.LoaiMedia;
import com.sale_oto.carshop.repository.DichVuRepository;
import com.sale_oto.carshop.repository.MediaRepository;
import com.sale_oto.carshop.repository.OToRepository;
import com.sale_oto.carshop.repository.PhuKienRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DemoMediaSeeder implements ApplicationRunner {

    private final MediaRepository mediaRepository;
    private final OToRepository oToRepository;
    private final PhuKienRepository phuKienRepository;
    private final DichVuRepository dichVuRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedDemoServices();
        seedCarImages();
        seedAccessoryImages();
        seedServiceImages();
    }

    private void seedDemoServices() {
        if (dichVuRepository.count() > 0) {
            return;
        }

        List<DichVuSeed> services = List.of(
                new DichVuSeed(
                        "Bảo dưỡng định kỳ 5.000 km",
                        "Kiểm tra tổng quát, thay dầu máy, kiểm tra lọc gió, nước làm mát, phanh và hệ thống điện cơ bản.",
                        "90 phút",
                        "950000"),
                new DichVuSeed(
                        "Thay dầu động cơ tổng hợp",
                        "Thay dầu động cơ chất lượng cao và kiểm tra nhanh khoang máy cho sedan, CUV và SUV phổ biến.",
                        "45 phút",
                        "750000"),
                new DichVuSeed(
                        "Vệ sinh nội thất chuyên sâu",
                        "Làm sạch ghế, sàn, taplo, khe gió điều hòa và khử mùi khoang cabin bằng thiết bị chuyên dụng.",
                        "3 giờ",
                        "1200000"),
                new DichVuSeed(
                        "Phủ ceramic 1 lớp",
                        "Đánh bóng và phủ ceramic giúp tăng độ bóng, hạn chế bám bẩn và bảo vệ bề mặt sơn xe.",
                        "6 giờ",
                        "3990000"),
                new DichVuSeed(
                        "Cân bằng động lốp",
                        "Cân bằng động bốn bánh giúp giảm rung lắc vô lăng và tăng độ ổn định khi chạy tốc độ cao.",
                        "60 phút",
                        "550000"),
                new DichVuSeed(
                        "Kiểm tra hệ thống phanh",
                        "Kiểm tra má phanh, đĩa phanh, dầu phanh và tư vấn thay thế khi phát hiện hao mòn bất thường.",
                        "45 phút",
                        "350000"),
                new DichVuSeed(
                        "Bảo dưỡng hệ thống điều hòa",
                        "Kiểm tra gas, vệ sinh dàn lạnh, dàn nóng và khử mùi hệ thống điều hòa xe.",
                        "75 phút",
                        "600000"),
                new DichVuSeed(
                        "Căn chỉnh góc đặt bánh xe",
                        "Căn chỉnh thước lái giúp xe vận hành ổn định, hạn chế lệch lái và mòn lốp không đều.",
                        "60 phút",
                        "1400000")
        );

        for (DichVuSeed seed : services) {
            DichVu dichVu = new DichVu();
            dichVu.setTenDichVu(seed.name());
            dichVu.setMoTa(seed.description());
            dichVu.setThoiGianUocTinh(seed.duration());
            dichVu.setGia(new BigDecimal(seed.price()));
            dichVu.setTrangThai(true);
            dichVuRepository.save(dichVu);
        }
    }

    private void seedCarImages() {
        List<DemoImage> images = List.of(
                new DemoImage(1L, LoaiDoiTuong.OTO, "/demo-images/cars/001-toyota-camry-2-5q.jpg"),
                new DemoImage(2L, LoaiDoiTuong.OTO, "/demo-images/cars/021-honda-cr-v-e-hev-rs.jpeg"),
                new DemoImage(3L, LoaiDoiTuong.OTO, "/demo-images/cars/003-kia-sorento-signature.jpg"),
                new DemoImage(4L, LoaiDoiTuong.OTO, "/demo-images/cars/032-ford-everest-titanium-2-0l-4x4-at.jpg"),
                new DemoImage(5L, LoaiDoiTuong.OTO, "/demo-images/cars/005-mercedes-c200-avantgarde.jpg"),
                new DemoImage(6L, LoaiDoiTuong.OTO, "/demo-images/cars/006-vinfast-vf8-plus.jpg"),
                new DemoImage(7L, LoaiDoiTuong.OTO, "/demo-images/cars/027-hyundai-tucson-2-0-xang-dac-biet.jpg"),
                new DemoImage(8L, LoaiDoiTuong.OTO, "/demo-images/cars/024-mazda-cx-5-2-5-signature-sport.jpg"),
                new DemoImage(9L, LoaiDoiTuong.OTO, "/demo-images/cars/009-mitsubishi-xpander-cross.jpg"),
                new DemoImage(10L, LoaiDoiTuong.OTO, "/demo-images/cars/010-toyota-fortuner-legender.jpg")
        );

        seedImages(images, oToRepository);
    }

    private void seedAccessoryImages() {
        List<DemoImage> images = List.of(
                new DemoImage(1L, LoaiDoiTuong.PHU_KIEN, "/demo-images/accessories/018-lop-bridgestone-turanza-t005a-225-50r18.png"),
                new DemoImage(2L, LoaiDoiTuong.PHU_KIEN, "/demo-images/accessories/002-l-c-gi-ng-c-toyota.jpg"),
                new DemoImage(3L, LoaiDoiTuong.PHU_KIEN, "/demo-images/accessories/030-may-bom-lop-mini-xiaomi-portable-air-pump.png"),
                new DemoImage(4L, LoaiDoiTuong.PHU_KIEN, "/demo-images/accessories/015-camera-lui-icar-elliview-s3.jpg"),
                new DemoImage(5L, LoaiDoiTuong.PHU_KIEN, "/demo-images/accessories/006-th-m-l-t-s-n-3d-toyota-camry.jpg"),
                new DemoImage(6L, LoaiDoiTuong.PHU_KIEN, "/demo-images/accessories/006-th-m-l-t-s-n-3d-toyota-camry.jpg"),
                new DemoImage(7L, LoaiDoiTuong.PHU_KIEN, "/demo-images/accessories/040-moc-treo-do-sau-ghe-hop-kim-2-chiec.jpg"),
                new DemoImage(8L, LoaiDoiTuong.PHU_KIEN, "/demo-images/accessories/034-den-led-philips-ultinon-pro6000-h11.jpg"),
                new DemoImage(9L, LoaiDoiTuong.PHU_KIEN, "/demo-images/accessories/009-b-nh-c-quy-gs-55ah-12v.jpg"),
                new DemoImage(10L, LoaiDoiTuong.PHU_KIEN, "/demo-images/accessories/029-bo-khan-microfiber-3m-3-chiec.jpg")
        );

        seedImages(images, phuKienRepository);
    }

    private void seedServiceImages() {
        List<DemoImage> images = List.of(
                new DemoImage(1L, LoaiDoiTuong.DICH_VU, "/demo-images/services/001-bao-duong-dinh-ky-5-000-km.jpg"),
                new DemoImage(2L, LoaiDoiTuong.DICH_VU, "/demo-images/services/004-ve-sinh-noi-that-co-ban.jpeg"),
                new DemoImage(3L, LoaiDoiTuong.DICH_VU, "/demo-images/services/004-ve-sinh-noi-that-co-ban.jpeg"),
                new DemoImage(4L, LoaiDoiTuong.DICH_VU, "/demo-images/services/005-ve-sinh-khoang-may.jpg"),
                new DemoImage(5L, LoaiDoiTuong.DICH_VU, "/demo-images/services/008-can-bang-dong-lop.jpg"),
                new DemoImage(6L, LoaiDoiTuong.DICH_VU, "/demo-images/services/009-kiem-tra-he-thong-phanh.jpg"),
                new DemoImage(7L, LoaiDoiTuong.DICH_VU, "/demo-images/services/012-bao-duong-he-thong-dieu-hoa.jpg"),
                new DemoImage(8L, LoaiDoiTuong.DICH_VU, "/demo-images/services/010-danh-bong-son-xe-1-buoc.jpg")
        );

        seedImages(images, dichVuRepository);
    }

    private void seedImages(List<DemoImage> images, JpaRepository<?, Long> repository) {
        for (DemoImage image : images) {
            if (!repository.existsById(image.id())) {
                continue;
            }

            boolean hasImage = !mediaRepository
                    .findByLoaiDoiTuongAndDoiTuongIdAndLoaiMediaOrderByThuTuAsc(
                            image.loaiDoiTuong(), image.id(), LoaiMedia.IMAGE)
                    .isEmpty();

            if (hasImage) {
                continue;
            }

            mediaRepository.save(Media.builder()
                    .loaiDoiTuong(image.loaiDoiTuong())
                    .doiTuongId(image.id())
                    .loaiMedia(LoaiMedia.IMAGE)
                    .url(image.url())
                    .publicId("demo/" + image.loaiDoiTuong().name().toLowerCase() + "/" + image.id())
                    .moTa("Demo " + image.loaiDoiTuong().name().toLowerCase() + " image")
                    .thuTu(1)
                    .build());
        }
    }

    private record DemoImage(Long id, LoaiDoiTuong loaiDoiTuong, String url) {
    }

    private record DichVuSeed(String name, String description, String duration, String price) {
    }
}
