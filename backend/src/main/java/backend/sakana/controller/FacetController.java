package backend.sakana.controller;

import backend.sakana.repository.FishRepository;
import backend.sakana.repository.PostRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/facets")
public class FacetController {

    private final FishRepository fishRepository;
    private final PostRepository postRepository;

    public FacetController(FishRepository fishRepository, PostRepository postRepository) {
        this.fishRepository = fishRepository;
        this.postRepository = postRepository;
    }

    @GetMapping("/fish")
    public ResponseEntity<List<String>> fish(@RequestParam(name = "q", required = false) String q,
                                             @RequestParam(name = "limit", defaultValue = "5") int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 50));
        List<String> names = fishRepository.findNames(q);
        return ResponseEntity.ok(names.stream().limit(safeLimit).toList());
    }

    @GetMapping("/locations")
    public ResponseEntity<List<String>> locations(@RequestParam(name = "q", required = false) String q,
                                                  @RequestParam(name = "limit", defaultValue = "5") int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 50));
        List<String> locations = postRepository.findLocations(q);
        return ResponseEntity.ok(locations.stream().limit(safeLimit).toList());
    }
}

