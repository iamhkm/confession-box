package com.hkm.confession_box;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ConfessionBoxApplication {

	public static void main(String[] args) {
		SpringApplication.run(ConfessionBoxApplication.class, args);
	}
}
