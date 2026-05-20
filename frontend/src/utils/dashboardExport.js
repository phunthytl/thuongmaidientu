import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const STATUS_LABEL = {
    CHO_XAC_NHAN: 'Chờ Xác Nhận',
    DA_XAC_NHAN: 'Đã Xác Nhận',
    DANG_XU_LY: 'Đang Xử Lý',
    DANG_GIAO: 'Đang Giao',
    HOAN_THANH: 'Hoàn Thành',
    DA_HUY: 'Đã Hủy',
};

const APPT_STATUS_LABEL = {
    CHO_XAC_NHAN: 'Chờ Xác Nhận',
    DA_XAC_NHAN: 'Đã Xác Nhận',
    DA_HOAN_THANH: 'Đã Hoàn Thành',
    DA_HUY: 'Đã Hủy',
};

const PRODUCT_TYPE_LABEL = { OTO: 'Ô tô', PHU_KIEN: 'Phụ kiện', DICH_VU: 'Dịch vụ' };

const fmtVND = (n) => new Intl.NumberFormat('vi-VN').format(Math.round(n || 0)) + ' VND';
const fmtDate = (d) => d ? new Date(d).toLocaleString('vi-VN') : '';
const fmtDateOnly = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '';
const fmtPct = (p) => p == null || isNaN(p) ? '—' : `${p > 0 ? '+' : ''}${Number(p).toFixed(1)}%`;

const todayFileTag = () => {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}_${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`;
};

// ============ EXCEL ============
export function exportDashboardToExcel({ days, kpi, trend, statusStats, apptStatusStats, topProducts, recentOrders }) {
    const wb = XLSX.utils.book_new();

    // Sheet 1: KPI Overview
    const kpiRows = [
        ['BÁO CÁO TỔNG QUAN KINH DOANH'],
        [`Khoảng thời gian: ${days} ngày qua`],
        [`Xuất lúc: ${new Date().toLocaleString('vi-VN')}`],
        [],
        ['CHỈ SỐ', 'GIÁ TRỊ', 'KỲ TRƯỚC', 'BIẾN ĐỘNG'],
        ['Tổng doanh thu', fmtVND(kpi?.tongDoanhThu), fmtVND(kpi?.doanhThuKyTruoc), fmtPct(kpi?.doanhThuChangePercent)],
        ['  - Doanh thu phụ kiện', fmtVND(kpi?.doanhThuPhuKien), '', ''],
        ['  - Doanh thu dịch vụ', fmtVND(kpi?.doanhThuDichVu), '', ''],
        ['Số giao dịch', kpi?.soDonHang ?? 0, kpi?.soDonHangKyTruoc ?? 0, fmtPct(kpi?.donHangChangePercent)],
        ['  - Đơn phụ kiện', kpi?.soDonPhuKien ?? 0, '', ''],
        ['  - Lượt dịch vụ', kpi?.soLuotDichVu ?? 0, '', ''],
        ['Khách hàng', kpi?.khachMoi ?? 0, kpi?.khachMoiKyTruoc ?? 0, fmtPct(kpi?.khachMoiChangePercent)],
        ['Giá trị TB / GD', fmtVND(kpi?.aov), fmtVND(kpi?.aovKyTruoc), fmtPct(kpi?.aovChangePercent)],
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(kpiRows);
    ws1['!cols'] = [{ wch: 28 }, { wch: 22 }, { wch: 22 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Tổng quan KPI');

    // Sheet 2: Revenue trend
    const trendRows = [
        ['Ngày', 'Doanh thu (VND)', 'Số giao dịch'],
        ...(trend || []).map(p => [
            fmtDateOnly(p.ngay),
            Number(p.doanhThu || 0),
            Number(p.soDonHang || 0),
        ]),
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(trendRows);
    ws2['!cols'] = [{ wch: 14 }, { wch: 20 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Doanh thu theo ngày');

    // Sheet 3: Top products
    const topRows = [
        ['#', 'Loại', 'Tên sản phẩm', 'Số lượng bán', 'Doanh thu (VND)'],
        ...(topProducts || []).map((p, i) => [
            i + 1,
            PRODUCT_TYPE_LABEL[p.loaiSanPham] || p.loaiSanPham,
            p.tenSanPham || '',
            Number(p.soLuongBan || 0),
            Number(p.doanhThu || 0),
        ]),
    ];
    const ws3 = XLSX.utils.aoa_to_sheet(topRows);
    ws3['!cols'] = [{ wch: 5 }, { wch: 12 }, { wch: 40 }, { wch: 14 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, ws3, 'Top sản phẩm');

    // Sheet 4: Recent orders
    const ordersRows = [
        ['Mã đơn', 'Khách hàng', 'Tổng tiền (VND)', 'Trạng thái', 'Ngày tạo'],
        ...(recentOrders || []).map(o => [
            o.maDonHang || `#${o.id}`,
            o.tenKhachHang || '',
            Number(o.tongTien || 0),
            STATUS_LABEL[o.trangThai] || o.trangThai,
            fmtDate(o.ngayTao),
        ]),
    ];
    const ws4 = XLSX.utils.aoa_to_sheet(ordersRows);
    ws4['!cols'] = [{ wch: 18 }, { wch: 28 }, { wch: 18 }, { wch: 16 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, ws4, 'Đơn hàng gần đây');

    // Sheet 5: Status breakdown
    const statusRows = [
        ['TRẠNG THÁI ĐƠN HÀNG'],
        ['Trạng thái', 'Số lượng'],
        ...(statusStats || []).map(s => [STATUS_LABEL[s.trangThai] || s.trangThai, Number(s.soLuong || 0)]),
        [],
        ['TRẠNG THÁI LỊCH HẸN DỊCH VỤ'],
        ['Trạng thái', 'Số lượng'],
        ...(apptStatusStats || []).map(s => [APPT_STATUS_LABEL[s.trangThai] || s.trangThai, Number(s.soLuong || 0)]),
    ];
    const ws5 = XLSX.utils.aoa_to_sheet(statusRows);
    ws5['!cols'] = [{ wch: 22 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, ws5, 'Trạng thái');

    XLSX.writeFile(wb, `dashboard-${days}d-${todayFileTag()}.xlsx`);
}

// ============ PDF ============
export function exportDashboardToPdf({ days, kpi, trend, statusStats, apptStatusStats, topProducts, recentOrders }) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 40;

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('BAO CAO TONG QUAN KINH DOANH', pageWidth / 2, y, { align: 'center' });
    y += 22;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(110);
    doc.text(`Khoang thoi gian: ${days} ngay qua  -  Xuat luc: ${new Date().toLocaleString('vi-VN')}`, pageWidth / 2, y, { align: 'center' });
    doc.setTextColor(0);
    y += 24;

    // KPI table — dùng latin để tránh lỗi font tiếng Việt trong PDF mặc định
    autoTable(doc, {
        startY: y,
        head: [['Chi so', 'Gia tri', 'Ky truoc', 'Bien dong']],
        body: [
            ['Tong doanh thu', fmtVND(kpi?.tongDoanhThu), fmtVND(kpi?.doanhThuKyTruoc), fmtPct(kpi?.doanhThuChangePercent)],
            ['  Doanh thu Phu kien', fmtVND(kpi?.doanhThuPhuKien), '', ''],
            ['  Doanh thu Dich vu', fmtVND(kpi?.doanhThuDichVu), '', ''],
            ['So giao dich', String(kpi?.soDonHang ?? 0), String(kpi?.soDonHangKyTruoc ?? 0), fmtPct(kpi?.donHangChangePercent)],
            ['  Don Phu kien', String(kpi?.soDonPhuKien ?? 0), '', ''],
            ['  Luot Dich vu', String(kpi?.soLuotDichVu ?? 0), '', ''],
            ['Khach hang', String(kpi?.khachMoi ?? 0), String(kpi?.khachMoiKyTruoc ?? 0), fmtPct(kpi?.khachMoiChangePercent)],
            ['Gia tri TB / GD', fmtVND(kpi?.aov), fmtVND(kpi?.aovKyTruoc), fmtPct(kpi?.aovChangePercent)],
        ],
        headStyles: { fillColor: [17, 17, 17], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 6 },
        columnStyles: { 0: { cellWidth: 200 } },
        margin: { left: 40, right: 40 },
    });
    y = doc.lastAutoTable.finalY + 20;

    // Top products
    if (topProducts?.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Top san pham ban chay', 40, y);
        y += 8;
        autoTable(doc, {
            startY: y,
            head: [['#', 'Loai', 'Ten san pham', 'SL', 'Doanh thu']],
            body: topProducts.map((p, i) => [
                i + 1,
                PRODUCT_TYPE_LABEL[p.loaiSanPham] || p.loaiSanPham,
                p.tenSanPham || '',
                String(p.soLuongBan || 0),
                fmtVND(p.doanhThu),
            ]),
            headStyles: { fillColor: [197, 160, 89], textColor: 255, fontStyle: 'bold' },
            styles: { fontSize: 9, cellPadding: 5 },
            columnStyles: { 0: { cellWidth: 25 }, 1: { cellWidth: 70 }, 3: { cellWidth: 35 } },
            margin: { left: 40, right: 40 },
        });
        y = doc.lastAutoTable.finalY + 20;
    }

    // Recent orders
    if (recentOrders?.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Don hang gan day', 40, y);
        y += 8;
        autoTable(doc, {
            startY: y,
            head: [['Ma don', 'Khach hang', 'Tong tien', 'Trang thai', 'Ngay tao']],
            body: recentOrders.slice(0, 10).map(o => [
                o.maDonHang || `#${o.id}`,
                o.tenKhachHang || '',
                fmtVND(o.tongTien),
                STATUS_LABEL[o.trangThai] || o.trangThai,
                fmtDate(o.ngayTao),
            ]),
            headStyles: { fillColor: [17, 17, 17], textColor: 255, fontStyle: 'bold' },
            styles: { fontSize: 8, cellPadding: 5 },
            margin: { left: 40, right: 40 },
        });
        y = doc.lastAutoTable.finalY + 20;
    }

    // New page if running out
    if (y > 720) { doc.addPage(); y = 40; }

    // Status tables
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Trang thai', 40, y);
    y += 8;
    autoTable(doc, {
        startY: y,
        head: [['Trang thai DON HANG', 'So luong']],
        body: (statusStats || []).map(s => [STATUS_LABEL[s.trangThai] || s.trangThai, String(s.soLuong || 0)]),
        headStyles: { fillColor: [17, 17, 17], textColor: 255 },
        styles: { fontSize: 9, cellPadding: 5 },
        margin: { left: 40, right: 40 },
    });
    y = doc.lastAutoTable.finalY + 12;

    autoTable(doc, {
        startY: y,
        head: [['Trang thai LICH HEN', 'So luong']],
        body: (apptStatusStats || []).map(s => [APPT_STATUS_LABEL[s.trangThai] || s.trangThai, String(s.soLuong || 0)]),
        headStyles: { fillColor: [197, 160, 89], textColor: 255 },
        styles: { fontSize: 9, cellPadding: 5 },
        margin: { left: 40, right: 40 },
    });

    // Footer page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
            `CarShop Dashboard - Trang ${i}/${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 20,
            { align: 'center' }
        );
    }

    doc.save(`dashboard-${days}d-${todayFileTag()}.pdf`);
}
