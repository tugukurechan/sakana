package backend.sakana.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalDateTime;

@Entity
@Table(name = "user")
@Getter
@Setter
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "username")
    private String userName;

    @Column(name = "display_name")
    private String displayName;

    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // getter / setter
    // コンストラクタ
}
