// إعدادات الأمان والحماية لتطبيق Limo Cut
 const SECURITY_CONFIG = {
     ENABLE_SANITIZATION: true,
     ALLOWED_TYPES: ['video/mp4', 'video/webm', 'image/jpeg', 'image/png', 'audio/mpeg', 'audio/wav'],
     MAX_FILE_SIZE: 2 * 1024 * 1024 * 1024, // 2GB
     AUTO_SAVE_INTERVAL: 30000, // 30 seconds
     FIREBASE: {
         API_KEY: "AIzaSyCz5KxZ8u97wQfXbM7yY6aW8eR9tU0vX7z5a4b3c2d1e0f9g8h7j6k5l4m3n2o1p0q",
         AUTH_DOMAIN: "limocut-app.firebaseapp.com",
         PROJECT_ID: "limocut-app",
         STORAGE_BUCKET: "limocut-app.appspot.com",
         MESSAGING_SENDER_ID: "123456789012",
         APP_ID: "1:123456789012:web:abc123def456ghi789jkl01"
     }
 };
