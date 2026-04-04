package backend.sakana.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record TopPostResponse(
        Integer postId,
        String title,
        String content,
        Integer amount,
        Double size,
        LocalDate caughtAt,
        String location,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<String> fishNames,
        String author
) {
}
