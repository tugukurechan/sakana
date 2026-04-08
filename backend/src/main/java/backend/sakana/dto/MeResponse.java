package backend.sakana.dto;

public record MeResponse(
        Integer id,
        String username,
        String displayName,
        String email
) {
}

