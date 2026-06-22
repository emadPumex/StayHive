package com.stayhive.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class ImageUploadService {

    private final Cloudinary cloudinary;

    // Spring auto-injects our Cloudinary bean here
    public ImageUploadService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public Map uploadImage(MultipartFile file, String folderName) throws IOException {
        // Options like designating a specific folder destination
        Map options = ObjectUtils.asMap(
                "folder", folderName
        );

        // Execute the upload to your Cloudinary storage bucket
        return cloudinary.uploader().upload(file.getBytes(), options);
    }
}