package backend.sakana.repository;

import backend.sakana.entity.PostEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<PostEntity, Integer> {

    // 最新3件を取得（created_at 降順）
    @EntityGraph(attributePaths = {"author", "fishes"})
    List<PostEntity> findTop3ByOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = {"author", "fishes"})
    @Query("""
            SELECT p
            FROM PostEntity p
            ORDER BY p.createdAt DESC
            """)
    List<PostEntity> findLatest(org.springframework.data.domain.Pageable pageable);

    @EntityGraph(attributePaths = {"author", "fishes"})
    @Query("""
            SELECT p
            FROM PostEntity p
            WHERE (:q IS NULL OR :q = '' OR LOWER(p.title) LIKE LOWER(CONCAT('%', :q, '%')))
            ORDER BY p.createdAt DESC
            """)
    List<PostEntity> search(@Param("q") String q, org.springframework.data.domain.Pageable pageable);

    @EntityGraph(attributePaths = {"author", "fishes"})
    @Query("""
            SELECT DISTINCT p
            FROM PostEntity p
            LEFT JOIN p.fishes f
            WHERE (:q IS NULL OR :q = '' OR LOWER(p.title) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(f.name) LIKE LOWER(CONCAT('%', :q, '%')))
              AND (:location IS NULL OR :location = '' OR LOWER(p.location) LIKE LOWER(CONCAT('%', :location, '%')))
              AND (:fish IS NULL OR :fish = '' OR LOWER(f.name) = LOWER(:fish))
            ORDER BY p.createdAt DESC
            """)
    List<PostEntity> searchAdvanced(
            @Param("q") String q,
            @Param("location") String location,
            @Param("fish") String fish
    );

    @EntityGraph(attributePaths = {"author", "fishes"})
    @Query(
            value = """
                    SELECT DISTINCT p
                    FROM PostEntity p
                    LEFT JOIN p.fishes f
                    WHERE (:q IS NULL OR :q = '' OR LOWER(p.title) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(f.name) LIKE LOWER(CONCAT('%', :q, '%')))
                      AND (:location IS NULL OR :location = '' OR LOWER(p.location) LIKE LOWER(CONCAT('%', :location, '%')))
                      AND (:fish IS NULL OR :fish = '' OR LOWER(f.name) = LOWER(:fish))
                    """,
            countQuery = """
                    SELECT COUNT(DISTINCT p)
                    FROM PostEntity p
                    LEFT JOIN p.fishes f
                    WHERE (:q IS NULL OR :q = '' OR LOWER(p.title) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(f.name) LIKE LOWER(CONCAT('%', :q, '%')))
                      AND (:location IS NULL OR :location = '' OR LOWER(p.location) LIKE LOWER(CONCAT('%', :location, '%')))
                      AND (:fish IS NULL OR :fish = '' OR LOWER(f.name) = LOWER(:fish))
                    """
    )
    Page<PostEntity> searchAdvancedPage(
            @Param("q") String q,
            @Param("location") String location,
            @Param("fish") String fish,
            Pageable pageable
    );

    @Query("""
            SELECT DISTINCT p.location
            FROM PostEntity p
            WHERE p.location IS NOT NULL AND p.location <> ''
              AND (:q IS NULL OR :q = '' OR LOWER(p.location) LIKE LOWER(CONCAT('%', :q, '%')))
            ORDER BY p.location ASC
            """)
    List<String> findLocations(@Param("q") String q);
}