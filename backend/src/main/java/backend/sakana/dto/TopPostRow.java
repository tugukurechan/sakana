package backend.sakana.dto;

import java.util.Date;

public record TopPostRow(
        Integer post_id,
        String title,
        String content,
        Double size,
        String fishName,
        Date caughtAt,
        String location,
        Date createdAt
) {
}
