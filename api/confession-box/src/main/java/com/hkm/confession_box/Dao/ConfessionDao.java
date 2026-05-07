package com.hkm.confession_box.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.hkm.confession_box.models.Confession;

@Repository
public interface ConfessionDao extends JpaRepository<Confession, Integer> {

	List<Confession> findByUserId(Integer id);

}
