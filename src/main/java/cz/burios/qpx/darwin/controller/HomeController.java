package cz.burios.qpx.darwin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

import cz.burios.qpx.darwin.db.DBContext;

import org.springframework.ui.Model;

@Controller
public class HomeController {

	@GetMapping("/")
	public ModelAndView index() {
		ModelAndView view = new ModelAndView("index");
		try {
			view.addObject("tables", DBContext.getTables());
			/*
			// SELECT s offsetem
			List<BasicRecord> data = new SelectDao()
				.select("file_store")
				.where("file_name LIKE ?", "%.png")
				.orderBy("id", "DESC")
				.limit(10)
				.offset(20)
				.execute();
			
			// INSERT
			BasicRecord rec = new BasicRecord();
			rec.setString("id", "FS02_00000099");
			rec.setString("file_name", "novy.png");
			new InsertDao().insert("file_store").values(rec).execute();
			
			// UPDATE
			BasicRecord upd = new BasicRecord();
			upd.setString("file_name", "upraveny.png");
			new UpdateDao().update("file_store").set(upd).where("id=?", "FS02_00000099").execute();
			
			// DELETE
			new DeleteDao().delete("file_store").where("id=?", "FS02_00000099").execute();	
			
			// ----------------------------------------------------------
			
			List<BasicRecord> data = BasicDaoFactory
				.select("id", "file_name")
				.from("file_store")
				.where("id=?", "FS02_00000001")
				.orderBy("id", "DESC")
				.limit(10)
				.offset(20)
				.execute();

			BasicRecord rec = new BasicRecord();
			rec.setString("id", "FS02_00000100");
			rec.setString("file_name", "novy.png");
			
			BasicDaoFactory.insert("file_store")
				.values(rec)
				.execute();

			BasicRecord upd = new BasicRecord();
			upd.setString("file_name", "upraveny.png");
			
			BasicDaoFactory.update("file_store")
				.set(upd)
				.where("id=?", "FS02_00000100")
				.execute();

			BasicDaoFactory.delete("file_store")
				.where("id=?", "FS02_00000100")
				.execute();    		
			 */
		} catch (Exception e) {
			e.printStackTrace();
		}
		return view;
	}
}