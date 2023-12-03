package com.periscope.backend.user;

import lombok.*;
import org.bson.types.Binary;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Base64;

@Data
@Document(collection = "users.resume")
public class MongoResume {

    @Field("resume_name")
    private String resumeName;
    @Field("file")
    private Binary file;

}
