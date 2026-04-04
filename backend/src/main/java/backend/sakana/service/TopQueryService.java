package backend.sakana.service;

import backend.sakana.dto.TopPostResponse;
import backend.sakana.entity.FishEntity;
import backend.sakana.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class TopQueryService {

    private final PostRepository postRepository;

    public TopQueryService(PostRepository postRepository){
        this.postRepository = postRepository;
    }

    public List<TopPostResponse> getTopPosts(){
        return postRepository.findTop3ByOrderByCreatedAtDesc()
                .stream()
                .map(post -> new TopPostResponse(
                        post.getId(),
                        post.getTitle(),
                        post.getContent(),
                        post.getAmount(),
                        post.getSize(),
                        post.getCaughtAt(),
                        post.getLocation(),
                        post.getCreatedAt(),
                        post.getUpdatedAt(),
                        post.getFishes() == null
                                ? List.of()
                                : post.getFishes().stream()
                                .map(FishEntity::getName)
                                .filter(Objects::nonNull)
                                .toList(),
                        post.getAuthor() == null ? null : post.getAuthor().getUserName()
                )).toList();
    }
}
