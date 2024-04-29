package com.periscope.backend.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.bson.types.Binary;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Base64;

@Data
@Document(collection = "users.resume")
public class MongoResume {

    @Field("resume_name") @NotBlank @JsonProperty("resume_name")
    private String resumeName;

    @Field("file") @NotNull @JsonProperty("String")
    private Binary file;

}
