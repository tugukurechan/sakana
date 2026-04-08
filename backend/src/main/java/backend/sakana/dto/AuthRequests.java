package backend.sakana.dto;

public class AuthRequests {
    public record LoginRequest(String username, String password) {
    }

    public record RegisterRequest(String username, String email, String password, String displayName) {
    }
}

