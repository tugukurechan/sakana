package backend.sakana.service;

import backend.sakana.dto.PostCreateRequest;
import backend.sakana.dto.PostResponse;
import backend.sakana.entity.FishEntity;
import backend.sakana.entity.PostEntity;
import backend.sakana.entity.UserEntity;
import backend.sakana.repository.FishRepository;
import backend.sakana.repository.PostRepository;
import backend.sakana.security.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;

@Service
public class PostCommandService {

    private final PostRepository postRepository;
    private final FishRepository fishRepository;

    public PostCommandService(PostRepository postRepository, FishRepository fishRepository) {
        this.postRepository = postRepository;
        this.fishRepository = fishRepository;
    }

    public PostResponse create(PostCreateRequest req, Authentication authentication) {
        if (req.title() == null || req.title().isBlank()) {
            throw new IllegalArgumentException("title is required");
        }
        if (req.content() == null || req.content().isBlank()) {
            throw new IllegalArgumentException("content is required");
        }
        UserEntity author = ((UserPrincipal) authentication.getPrincipal()).getUser();

        PostEntity post = new PostEntity();
        post.setTitle(req.title());
        post.setContent(req.content());
        post.setAuthor(author);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());

        var fishes = new LinkedHashSet<FishEntity>();
        if (req.fishNames() != null) {
            for (String raw : req.fishNames()) {
                if (raw == null) continue;
                String name = raw.trim();
                if (name.isEmpty()) continue;
                FishEntity fish = fishRepository.findByNameIgnoreCase(name).orElseGet(() -> {
                    FishEntity f = new FishEntity();
                    f.setName(name);
                    f.setCreatedAt(LocalDateTime.now());
                    f.setUpdatedAt(LocalDateTime.now());
                    return fishRepository.save(f);
                });
                fishes.add(fish);
            }
        }
        post.setFishes(fishes);

        PostEntity saved = postRepository.save(post);
        return new PostResponse(
                saved.getId(),
                saved.getTitle(),
                saved.getContent(),
                saved.getAmount(),
                saved.getSize(),
                saved.getCaughtAt(),
                saved.getLocation(),
                saved.getCreatedAt(),
                saved.getUpdatedAt(),
                saved.getFishes() == null ? List.of() : saved.getFishes().stream().map(FishEntity::getName).filter(Objects::nonNull).toList(),
                saved.getAuthor() == null ? null : saved.getAuthor().getUserName()
        );
    }
}

