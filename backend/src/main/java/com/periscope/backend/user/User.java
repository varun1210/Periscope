package com.periscope.backend.user;

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
    private String name;
    @Field("phone_number")
    private String phoneNumber;
    private String email;
    @Field("resumes")
    private List<MongoResume> resumes;
    @Field("saved_jobs")
    private List<String> savedJobs;
    @Field("applied_jobs")
    private List<String> appliedJobs;


}
