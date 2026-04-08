package backend.sakana.controller;

import backend.sakana.dto.AuthRequests.LoginRequest;
import backend.sakana.dto.AuthRequests.RegisterRequest;
import backend.sakana.dto.MeResponse;
import backend.sakana.entity.UserEntity;
import backend.sakana.repository.UserRepository;
import backend.sakana.security.UserPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public AuthController(
            AuthenticationManager authenticationManager,
            SecurityContextRepository securityContextRepository,
            PasswordEncoder passwordEncoder,
            UserRepository userRepository
    ) {
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<MeResponse> login(
            @RequestBody LoginRequest req,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.username(), req.password())
        );

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, request, response);

        return ResponseEntity.ok(toMe(auth));
    }

    @PostMapping("/register")
    public ResponseEntity<MeResponse> register(@RequestBody RegisterRequest req) {
        if (req.username() == null || req.username().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        if (req.password() == null || req.password().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        if (userRepository.existsByUserName(req.username())) {
            return ResponseEntity.status(409).build();
        }

        UserEntity user = new UserEntity();
        user.setUserName(req.username());
        user.setEmail(req.email());
        user.setDisplayName(req.displayName());
        user.setPasswordHash(passwordEncoder.encode(req.password()));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return ResponseEntity.ok(new MeResponse(user.getId(), user.getUserName(), user.getDisplayName(), user.getEmail()));
    }

    @GetMapping("/me")
    public ResponseEntity<MeResponse> me(Authentication authentication) {
        return ResponseEntity.ok(toMe(authentication));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        new SecurityContextLogoutHandler().logout(request, response, authentication);
        return ResponseEntity.ok().build();
    }

    private MeResponse toMe(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal principal)) {
            return new MeResponse(null, null, null, null);
        }
        var user = principal.getUser();
        return new MeResponse(user.getId(), user.getUserName(), user.getDisplayName(), user.getEmail());
    }
}

