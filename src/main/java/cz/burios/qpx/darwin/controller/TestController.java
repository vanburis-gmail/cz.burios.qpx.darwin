package cz.burios.qpx.darwin.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import cz.burios.qpx.darwin.db.dao.FileStoreDao;
import cz.burios.qpx.darwin.model.FileRecord;

@Controller
@RequestMapping("/test")
public class TestController {
	
	@GetMapping("/upload")
	public String showUploadForm(Model model) {
		try {
			FileStoreDao dao = new FileStoreDao();
			List<FileRecord> files = dao.findAll(); // nová metoda v DAO
			model.addAttribute("files", files);
		} catch (Exception e) {
			model.addAttribute("error", "Chyba při načítání seznamu souborů: " + e.getMessage());
		}
		return "upload";
	}
	

	@GetMapping("/download")
	public String showDownloadForm(Model model) {
		try {
			FileStoreDao dao = new FileStoreDao();
			List<FileRecord> files = dao.findAll();
			// System.out.println("FileController.showDownloadForm().files: " + files);
			model.addAttribute("files", files);
		} catch (Exception e) {
			model.addAttribute("error", "Chyba při načítání seznamu souborů: " + e.getMessage());
		}
		return "download";
	}	
}
