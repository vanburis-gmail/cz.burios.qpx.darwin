package cz.burios.qpx.darwin.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import cz.burios.qpx.darwin.db.dao.FileStoreDao;
import cz.burios.qpx.darwin.model.FileRecord;

@Controller
@RequestMapping("/p/modul")
public class ModulPageController {

	@GetMapping("/file_manager")
	public String showFileManager(Model model) {
		try {
			FileStoreDao dao = new FileStoreDao();
			List<FileRecord> files = dao.findAll();
			model.addAttribute("files", files);
		} catch (Exception e) {
			model.addAttribute("error", "Chyba při načítání souborů: " + e.getMessage());
		}
		return "p/file_manager";
	}
	
}
