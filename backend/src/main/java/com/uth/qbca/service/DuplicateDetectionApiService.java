package com.uth.qbca.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.uth.qbca.dto.DuplicateDetection.*;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import com.uth.qbca.utils.MultipartInputStreamFileResource;

import java.util.ArrayList;
import java.util.List;

@Service
public class DuplicateDetectionApiService {

    private final RestTemplate restTemplate;
    private final String BASE_URL = "http://127.0.0.1:8000";

    public DuplicateDetectionApiService() {
        this.restTemplate = new RestTemplate();
    }

    public String callHome() {
        return restTemplate.getForObject(BASE_URL + "/", String.class);
    }

    public DuplicateDetectionResponse addQuestion(DuplicateDetectionRequest request) {
        return postToPython("/add-question", request);
    }

    public DuplicateDetectionResponse checkDuplicate(DuplicateDetectionRequest request) {
        return postToPython("/check-duplicate", request);
    }

    public DuplicateDetectionResponse agencyRegister(DuplicateDetectionRequest request) {
        return postToPython("/agency-register", request);
    }

    private DuplicateDetectionResponse postToPython(String endpoint, DuplicateDetectionRequest body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<DuplicateDetectionRequest> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(BASE_URL + endpoint, entity, String.class);
        System.out.println("📥 Phản hồi từ Python API: " + response.getBody());

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode json = mapper.readTree(response.getBody());

            String status = json.has("status") ? json.get("status").asText("unknown") : "unknown";
            String message = json.has("message") ? json.get("message").asText(null) : null;

            List<DuplicateResultDetail> resultList = new ArrayList<>();

            if (json.has("duplicates") && json.get("duplicates").isArray()) {
                for (JsonNode item : json.get("duplicates")) {
                    if (item.has("text") && item.has("similarity")) {
                        resultList.add(new DuplicateResultDetail(
                                item.get("text").asText(),
                                item.get("similarity").asDouble()
                        ));
                    }
                }
            }

            if (json.has("data")) {
                JsonNode dataNode = json.get("data");
                if (dataNode.has("similar_found") && dataNode.get("similar_found").isArray()) {
                    for (JsonNode item : dataNode.get("similar_found")) {
                        if (item.has("text") && item.has("similarity")) {
                            resultList.add(new DuplicateResultDetail(
                                    item.get("text").asText(),
                                    item.get("similarity").asDouble()
                            ));
                        }
                    }
                }
            }

            DuplicateDetectionResponse result = new DuplicateDetectionResponse();
            result.setStatus(status);
            result.setMessage(message);
            result.setData(resultList);
            return result;

        } catch (Exception e) {
            DuplicateDetectionResponse error = new DuplicateDetectionResponse();
            error.setStatus("error");
            error.setMessage("Lỗi khi phân tích phản hồi từ API Python: " + e.getMessage());
            error.setData(null);
            return error;
        }
    }

    public DuplicateDetectionFileResponse checkDuplicatesFromFile(MultipartFile file) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new MultipartInputStreamFileResource(file.getInputStream(), file.getOriginalFilename()));

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    BASE_URL + "/check-duplicates-from-file",
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            System.out.println("📥 Python trả về: " + response.getBody());

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());

            // ✅ Kiểm tra nếu không có kết quả
            if (!root.has("results")) {
                throw new RuntimeException("Phản hồi không hợp lệ: " + root.toString());
            }

            List<DuplicateFromFileResult> parsedResults = new ArrayList<>();
            for (JsonNode node : root.get("results")) {
                DuplicateFromFileResult item = new DuplicateFromFileResult();
                item.setQuestion(node.has("query") ? node.get("query").asText() : null);
                item.setStatus(node.has("status") ? node.get("status").asText() : "unknown");

                List<DuplicateResultDetail> dups = new ArrayList<>();
                if (node.has("matches") && node.get("matches").isArray()) {
                    for (JsonNode dup : node.get("matches")) {
                        if (dup.has("text") && dup.has("similarity")) {
                            dups.add(new DuplicateResultDetail(
                                    dup.get("text").asText(),
                                    dup.get("similarity").asDouble()
                            ));
                        }
                    }
                }

                item.setDuplicates(dups);
                parsedResults.add(item);
            }

            DuplicateDetectionFileResponse result = new DuplicateDetectionFileResponse();
            result.setResults(parsedResults);
            return result;

        } catch (Exception e) {
            throw new RuntimeException("Lỗi gửi file đến API Python: " + e.getMessage(), e);
        }
    }
}