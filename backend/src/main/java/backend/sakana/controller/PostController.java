package backend.sakana.controller;

import backend.sakana.dto.PostCreateRequest;
import backend.sakana.dto.PostResponse;
import backend.sakana.dto.PostsPageResponse;
import backend.sakana.service.PostCommandService;
import backend.sakana.service.PostQueryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PostController {

    private final PostQueryService postQueryService;
    private final PostCommandService postCommandService;

    public PostController(PostQueryService postQueryService, PostCommandService postCommandService) {
        this.postQueryService = postQueryService;
        this.postCommandService = postCommandService;
    }

    @GetMapping("/posts")
    public ResponseEntity<PostsPageResponse> list(
            @RequestParam(name = "q", required = false) String q,
            @RequestParam(name = "location", required = false) String location,
            @RequestParam(name = "fish", required = false) String fish,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "latest") String sort
    ) {
        return ResponseEntity.ok(postQueryService.searchAdvancedPage(q, location, fish, page, size, sort));
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<PostResponse> detail(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(postQueryService.getById(id));
    }

    // /api/search は互換のため残す（将来的には /api/posts?q=... に統一）
    @GetMapping("/search")
    public ResponseEntity<List<PostResponse>> search(@RequestParam(name = "q", required = false) String q) {
        return ResponseEntity.ok(postQueryService.searchAdvanced(q, null, null));
    }

    @PostMapping("/posts")
    public ResponseEntity<PostResponse> create(@RequestBody PostCreateRequest req, Authentication authentication) {
        return ResponseEntity.ok(postCommandService.create(req, authentication));
    }
}

