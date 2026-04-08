package backend.sakana.service;

import backend.sakana.dto.PostResponse;
import backend.sakana.dto.PostsPageResponse;
import backend.sakana.entity.FishEntity;
import backend.sakana.entity.PostEntity;
import backend.sakana.repository.PostRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
@Service
public class PostQueryService {

    private final PostRepository postRepository;

    public PostQueryService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<PostResponse> listLatest(int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 50));
        var pageable = PageRequest.of(0, safeLimit, Sort.by(Sort.Direction.DESC, "createdAt"));
        return postRepository.findLatest(pageable).stream().map(this::toResponse).toList();
    }

    public List<PostResponse> listAll() {
        return postRepository.searchAdvanced(null, null, null).stream().map(this::toResponse).toList();
    }

    public List<PostResponse> search(String q, int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 50));
        var pageable = PageRequest.of(0, safeLimit, Sort.by(Sort.Direction.DESC, "createdAt"));
        return postRepository.search(q, pageable).stream().map(this::toResponse).toList();
    }

    public List<PostResponse> searchAdvanced(String q, String location, String fish) {
        return postRepository.searchAdvanced(q, location, fish).stream().map(this::toResponse).toList();
    }

    public PostsPageResponse searchAdvancedPage(String q, String location, String fish, int page, int size, String sort) {
        int safeSize = switch (size) {
            case 10, 20, 30 -> size;
            default -> 10;
        };
        int safePage = Math.max(0, page);
        Sort.Direction dir = "oldest".equalsIgnoreCase(sort) ? Sort.Direction.ASC : Sort.Direction.DESC;
        var pageable = PageRequest.of(safePage, safeSize, Sort.by(dir, "createdAt"));
        var result = postRepository.searchAdvancedPage(q, location, fish, pageable);
        var items = result.getContent().stream().map(this::toResponse).toList();
        return new PostsPageResponse(items, result.getTotalElements(), safePage, safeSize);
    }

    public PostResponse getById(Integer id) {
        PostEntity post = postRepository.findById(id).orElseThrow();
        return toResponse(post);
    }

    private PostResponse toResponse(PostEntity post) {
        List<String> fishNames = post.getFishes() == null
                ? List.of()
                : post.getFishes().stream()
                .map(FishEntity::getName)
                .filter(Objects::nonNull)
                .sorted(String.CASE_INSENSITIVE_ORDER)
                .toList();
        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getAmount(),
                post.getSize(),
                post.getCaughtAt(),
                post.getLocation(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                fishNames,
                post.getAuthor() == null ? null : post.getAuthor().getUserName()
        );
    }
}

