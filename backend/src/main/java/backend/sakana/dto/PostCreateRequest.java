package backend.sakana.dto;

import java.util.List;

public record PostCreateRequest(
        String title,
        String content,
        List<String> fishNames
) {
}

