package com.periscope.backend.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
@Document(collection = "users")
public class User {

    @Id
    private String userID;

    @NotBlank(message = "Name cannot be empty!")
    private String name;

    @Field("phone_number") @Pattern(regexp = "^(\\+\\d{1,4})?[-.\\s]?\\(?\\d{1,4}\\)?[-.\\s]?\\d{1,9}[-.\\s]?\\d{1,9}$")
    private String phoneNumber;

    @NotBlank(message = "Email cannot be empty!") @Email(message = "Invalid email!")
    private String email;

    @Field("resumes") @JsonProperty("resumes")
    private List<MongoResume> resumes;

    @Field("saved_jobs")
    private List<String> savedJobs;

    @Field("applied_jobs")
    private List<String> appliedJobs;

}
