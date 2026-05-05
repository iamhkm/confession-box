package com.hkm.confession_box.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class HashUtil {
	private final BCryptPasswordEncoder encoder =
            new BCryptPasswordEncoder();

    public String hashPassword(String password) {
        return encoder.encode(password);
    }
}
