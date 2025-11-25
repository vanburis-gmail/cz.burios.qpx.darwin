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
		view.addObject("tables", DBContext.getTables());
		return view;
	}
}