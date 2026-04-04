package backend.sakana.controller;

import backend.sakana.dto.TopPostResponse;
import backend.sakana.service.TopQueryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Top画面用のController
 * FEからのリクエストを受け、UseCaseを呼び出してJSONを返す
 */
@RestController
@RequestMapping("/api")
public class TopController {

    private final TopQueryService topQueryService;

    // コンストラクタインジェクション
    public TopController(TopQueryService topQueryService) {
        this.topQueryService = topQueryService;
    }

    // GET /top にアクセスしたときに呼ばれる
    @GetMapping("/top")
    public ResponseEntity<List<TopPostResponse>> top() {
        return ResponseEntity.ok(topQueryService.getTopPosts());
    }
}
