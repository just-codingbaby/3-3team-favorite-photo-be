import path from 'path';
import multer from 'multer';

// 파일 저장 경로 및 이름 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 파일 저장 디렉토리
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // 유니크한 파일 이름 생성
  },
});

// 파일 필터링 설정 (이미지 파일만 허용)
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif|webp/; // 허용되는 파일 확장자
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase()); // 파일 확장자 체크
  const mimetype = fileTypes.test(file.mimetype); // MIME 타입 체크

  if (extname && mimetype) {
    cb(null, true); // 허용된 파일
  } else {
    cb(new Error('이미지 파일만 업로드 가능합니다.'));
  }
};

// Multer 설정
const upload = multer({
  storage, // 파일 저장소 설정
  fileFilter, // 파일 필터링 설정
});

export default upload;
