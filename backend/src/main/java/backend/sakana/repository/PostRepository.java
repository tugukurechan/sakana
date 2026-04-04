package backend.sakana.repository;

import backend.sakana.entity.PostEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<PostEntity, Integer> {

    // 最新3件を取得（created_at 降順）
    @EntityGraph(attributePaths = {"author", "fishes"})
    List<PostEntity> findTop3ByOrderByCreatedAtDesc();
}