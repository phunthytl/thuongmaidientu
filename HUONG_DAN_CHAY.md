# Huong dan chay du an

Du an gom 3 phan:

- `backend`: Spring Boot API, chay cong `8080`
- `frontend`: React web admin/client, chay cong `3000`
- `mobile-app`: Expo React Native, web dev server chay cong `8081`

## Yeu cau

- Java 21
- Maven 3.9+
- Node.js va npm
- MySQL dang chay local

File backend hien tai doc cau hinh tu `backend/.env`. Database mac dinh:

```properties
DB_URL=jdbc:mysql://localhost:3306/carshop_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Ho_Chi_Minh
DB_USERNAME=root
DB_PASSWORD=123456
```

## 1. Chay backend

Tren may nay, Maven wrapper `backend/mvnw.cmd` dang loi, nen dung Maven trong cache va set `JAVA_HOME` ve Java 21:

```powershell
cd D:\download\thuongmaidientu\backend
$env:JAVA_HOME='D:\Nam34\java'
$env:PATH="$env:JAVA_HOME\bin;$env:PATH"
& 'C:\Users\Admin\.m2\wrapper\dists\apache-maven-3.9.12\59fe215c0ad6947fea90184bf7add084544567b927287592651fda3782e0e798\bin\mvn.cmd' spring-boot:run
```

Kiem tra backend:

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:8080/api/oto
```

Neu tra ve HTTP `200` la backend da chay.

## 2. Chay frontend web

PowerShell tren may nay chan `npm.ps1`, nen dung `npm.cmd`:

```powershell
cd D:\download\thuongmaidientu\frontend
npm.cmd install
npm.cmd start
```

Mo:

```text
http://localhost:3000
```

Frontend goi API backend tai:

```text
http://localhost:8080/api
```

## 3. Chay mobile app bang Expo

```powershell
cd D:\download\thuongmaidientu\mobile-app
npm.cmd install
npm.cmd start
```

Sau do:

- Bam `w` de chay tren web: `http://localhost:8081`
- Quet QR bang Expo Go de chay tren dien thoai
- Android Emulator dung API base URL: `http://10.0.2.2:8080/api`
- Mobile web/iOS Simulator co the dung: `http://localhost:8080/api`

Chay truc tiep mobile web:

```powershell
cd D:\download\thuongmaidientu\mobile-app
npm.cmd run web
```

## Lenh da xac nhan trong phien nay

- Backend dang listen tai `http://localhost:8080`
- Mobile Expo web dang listen tai `http://localhost:8081`
- `GET http://localhost:8080/api/oto` tra ve HTTP `200`
- `GET http://localhost:8081` tra ve HTTP `200`
- Frontend build/dev server compile thanh cong khi chay `npm.cmd start`; trong phien tu dong nay process frontend foreground bi dung do timeout cua tool.

## Dung server dang chay

Tim process theo cong:

```powershell
netstat -ano | Select-String -Pattern ':8080|:8081|:3000'
```

Dung process theo PID:

```powershell
Stop-Process -Id <PID>
```

