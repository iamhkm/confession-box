package com.hkm.confession_box.Dao;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.hkm.confession_box.models.User;

import java.util.Optional;

@Repository
public interface UserDao extends JpaRepository<User, Integer> {

	User findByUsernameAndPassword(String username, String hashedPassword);

	boolean existsByUsername(String username);

	boolean existsByEmail(String email);

	Optional<User> findByUsername(String username);

	Optional<User> findByEmail(String email);

	Optional<User> getByUsername(String username);

}
