package com.stayhive.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    // UPDATED: Added a dynamic folder path argument
    public String uploadFile(MultipartFile file, String folderPath) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            // Pass the folder option to Cloudinary's upload options map
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("folder", folderPath)
            );

            return uploadResult.get("secure_url").toString();

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file to Cloudinary in folder: " + folderPath, e);
        }
    }
}