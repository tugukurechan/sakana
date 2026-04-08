package backend.sakana.dto;

import java.util.List;

public record PostsPageResponse(
        List<PostResponse> items,
        long total,
        int page,
        int size
) {
}

