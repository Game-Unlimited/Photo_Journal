## Photo Journal (React + TypeScript + Vite + Capacitor)

Ứng dụng nhật ký ảnh mini. Cho phép chụp ảnh, đặt tiêu đề, lưu file trong Filesystem, metadata trong Preferences, xem gallery, xem chi tiết, sửa tiêu đề, xóa và chia sẻ ảnh.

### Cài đặt

```bash
npm install
npm run dev
```

Build sản phẩm:

```bash
npm run build
```

### Capacitor

Khởi tạo platform:

```bash
npx cap add android
npx cap add ios
```

Đồng bộ plugin sau mỗi lần cài đặt:

```bash
npx cap sync
```

### Permission Android (AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
```

### Permission iOS (Info.plist)

```xml
<key>NSCameraUsageDescription</key>
<string>Ứng dụng cần truy cập camera để chụp ảnh nhật ký</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>Ứng dụng cần lưu ảnh vào bộ nhớ để hiển thị trong nhật ký</string>
```

# Photo_Journal