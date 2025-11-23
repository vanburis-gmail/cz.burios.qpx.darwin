package cz.burios.qpx.darwin.web.file;

import org.springframework.web.multipart.MultipartFile;

import cz.burios.qpx.darwin.db.dao.FileStoreDao;

import java.io.File;
import java.io.IOException;

public class FileUploader {

	private final String uploadDir;
	private final FileStoreDao fileStoreDao = new FileStoreDao();
	
	public FileUploader(String uploadDir) {
		this.uploadDir = uploadDir;
	}

	public String uploadFile(MultipartFile multipartFile) throws Exception {
		if (multipartFile.isEmpty()) {
			throw new IOException("Soubor je prázdný");
		}
		File dir = new File(uploadDir);
		if (!dir.exists()) {
			dir.mkdirs();
		}
		String filePath = uploadDir + File.separator + multipartFile.getOriginalFilename();
		multipartFile.transferTo(new File(filePath));
        String id = fileStoreDao.saveFile(multipartFile.getOriginalFilename());
        return id;
	}
}