package com.RestroRealm.App;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.crypto.SecretKey;

@SpringBootApplication
public class RestroRealmApplication {

	public static void main(String[] args) {
		SpringApplication.run(RestroRealmApplication.class, args);
//		JwtKeyGenerator.main(new String[]{"", ""});
	}

}

//class JwtKeyGenerator {
//	public static void main(String[] args) {
//		// Generate a secure key for the HS512 algorithm
//		SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
//
//		// Print the base64-encoded key (you can store this key securely)
//		String encodedKey = java.util.Base64.getEncoder().encodeToString(key.getEncoded());
//		System.out.println("Generated Key: " + encodedKey);
//	}
//}