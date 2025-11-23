package cz.burios.qpx.darwin.web.file;

import jakarta.servlet.http.HttpServletResponse;

import java.io.*;

public class FileDownloader {

	private final String baseDir;

	public FileDownloader(String baseDir) {
		this.baseDir = baseDir;
	}

	public void downloadFile(String fileName, HttpServletResponse response) throws IOException {
		File file = new File(baseDir, fileName);
		if (!file.exists()) {
			response.sendError(HttpServletResponse.SC_NOT_FOUND, "Soubor nenalezen");
			return;
		}
		response.setContentType("application/octet-stream");
		response.setHeader("Content-Disposition", "attachment; filename=\"" + file.getName() + "\"");

		try (InputStream in = new FileInputStream(file); OutputStream out = response.getOutputStream()) {
			byte[] buffer = new byte[8192];
			int len;
			while ((len = in.read(buffer)) != -1) {
				out.write(buffer, 0, len);
			}
		}
	}
	
	public void downloadFileByName(String fileName, HttpServletResponse response) throws IOException {
		File file = new File(baseDir, fileName);
		if (!file.exists()) {
			response.sendError(HttpServletResponse.SC_NOT_FOUND, "Soubor nenalezen");
			return;
		}
		response.setContentType("application/octet-stream");
		response.setHeader("Content-Disposition", "attachment; filename=\"" + file.getName() + "\"");
		response.setContentLengthLong(file.length());

		try (InputStream in = new FileInputStream(file); OutputStream out = response.getOutputStream()) {
			byte[] buffer = new byte[8192];
			int len;
			while ((len = in.read(buffer)) != -1) {
				out.write(buffer, 0, len);
			}
			out.flush();
		}
	}
}