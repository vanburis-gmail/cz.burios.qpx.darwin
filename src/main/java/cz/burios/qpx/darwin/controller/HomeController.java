package cz.burios.qpx.darwin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;

@Controller
public class HomeController {

	@GetMapping("/")
	public String index(Model model) {
		model.addAttribute("message", "Hello from Spring 6 MVC + Tomcat 11!");
		return "index";
	}
}