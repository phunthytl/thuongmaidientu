START TRANSACTION;

CREATE TEMPORARY TABLE tmp_oto_orders AS
SELECT DISTINCT don_hang_id
FROM chi_tiet_don_hang
WHERE loai_san_pham = 'OTO';

CREATE TEMPORARY TABLE tmp_oto_carts AS
SELECT DISTINCT gio_hang_id
FROM chi_tiet_gio_hang
WHERE loai_san_pham = 'OTO';

DELETE FROM chi_tiet_don_hang
WHERE loai_san_pham = 'OTO';

DELETE FROM chi_tiet_gio_hang
WHERE loai_san_pham = 'OTO';

UPDATE don_hang dh
LEFT JOIN (
    SELECT don_hang_id, COALESCE(SUM(thanh_tien), 0) AS tong_chi_tiet
    FROM chi_tiet_don_hang
    GROUP BY don_hang_id
) ct ON ct.don_hang_id = dh.id
SET dh.tong_tien = COALESCE(ct.tong_chi_tiet, 0) + COALESCE(dh.phi_van_chuyen, 0)
WHERE dh.id IN (SELECT don_hang_id FROM tmp_oto_orders);

DELETE tt
FROM thanh_toan tt
LEFT JOIN chi_tiet_don_hang ct ON ct.don_hang_id = tt.don_hang_id
WHERE tt.don_hang_id IN (SELECT don_hang_id FROM tmp_oto_orders)
  AND ct.id IS NULL;

DELETE dh
FROM don_hang dh
LEFT JOIN chi_tiet_don_hang ct ON ct.don_hang_id = dh.id
WHERE dh.id IN (SELECT don_hang_id FROM tmp_oto_orders)
  AND ct.id IS NULL;

UPDATE gio_hang gh
LEFT JOIN (
    SELECT gio_hang_id, COALESCE(SUM(thanh_tien), 0) AS tong_chi_tiet
    FROM chi_tiet_gio_hang
    GROUP BY gio_hang_id
) ct ON ct.gio_hang_id = gh.id
SET gh.tong_tien = COALESCE(ct.tong_chi_tiet, 0)
WHERE gh.id IN (SELECT gio_hang_id FROM tmp_oto_carts);

DROP TEMPORARY TABLE tmp_oto_orders;
DROP TEMPORARY TABLE tmp_oto_carts;

COMMIT;
