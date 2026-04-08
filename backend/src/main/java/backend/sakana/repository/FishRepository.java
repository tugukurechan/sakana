package backend.sakana.repository;

import backend.sakana.entity.FishEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FishRepository extends JpaRepository<FishEntity, Integer> {
    Optional<FishEntity> findByNameIgnoreCase(String name);

    @Query("""
            SELECT f.name
            FROM FishEntity f
            WHERE (:q IS NULL OR :q = '' OR LOWER(f.name) LIKE LOWER(CONCAT('%', :q, '%')))
            ORDER BY f.name ASC
            """)
    List<String> findNames(@Param("q") String q);
}

