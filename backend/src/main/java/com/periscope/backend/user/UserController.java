package com.periscope.backend.user;

import com.periscope.backend.user.exceptions.UserExceptionHandler;
import com.periscope.backend.user.exceptions.UserNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private UserService userService;
    private UserExceptionHandler userExceptionHandler;

    @Autowired
    public void UserController(UserService userService, UserExceptionHandler userExceptionHandler) {
        this.userService = userService;
        this.userExceptionHandler = userExceptionHandler;
    }

    @GetMapping("/{userID}")
    public ResponseEntity getUser(@PathVariable String userID) {
        try {
            User user = userService.getUserService(userID);
            return new ResponseEntity(user, HttpStatus.OK);
        } catch (UserNotFoundException e) {
            return userExceptionHandler.userNotFoundHandler(e);
        } catch (Exception e) {
            return userExceptionHandler.serverErrorHandler(e);
        }
    }

    @PostMapping(value = "/create-user", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity createUser(@RequestParam User userInfo, @RequestPart List<MultipartFile> resumes) {
        try {
            System.out.println(userInfo);
            System.out.println(resumes);
            userService.createUserService(userInfo);
//            System.out.println(userResumes);
            Map<String, String> responseBody = userService.createUserServiceResponseBodyGenerator();
            return new ResponseEntity(responseBody, HttpStatus.OK);
        } catch (Exception e) {
            if(e instanceof MethodArgumentNotValidException) {
                return userExceptionHandler.handleValidationErrors((MethodArgumentNotValidException) e);
            } else {
                return userExceptionHandler.serverErrorHandler(e);
            }
        }
    }

    @DeleteMapping("/delete-user")
    public ResponseEntity deleteUser(@RequestBody String userID) {
        try {
            userService.deleteUserService(userID);
            Map responseBody = userService.deleteUserServiceResponseBodyGenerator();
            return new ResponseEntity(responseBody, HttpStatus.OK);
        } catch (UserNotFoundException e) {
            return userExceptionHandler.userNotFoundHandler(e);
        } catch (Exception e) {
            return userExceptionHandler.serverErrorHandler(e);
        }
    }

    @PutMapping("/{userID}/update-info")
    public ResponseEntity updateUserInfo(@PathVariable String userID, @Valid @RequestBody User userInfo) {
        try {
            userService.updateUserService(userID, userInfo);
            Map responseBody = userService.updateUserServiceResponseBodyGenerator();
            return new ResponseEntity(responseBody, HttpStatus.OK);
        } catch (UserNotFoundException e) {
            return userExceptionHandler.userNotFoundHandler(e);
        } catch (Exception e) {
            return userExceptionHandler.serverErrorHandler(e);
        }
    }

    @GetMapping("/{userID}/resumes")
    public ResponseEntity getUserResumes(@PathVariable String userID) {
        try {
            List<MongoResume> resumeList = userService.getUserResumesService(userID);
            HashMap<String, Object> responseBody = userService.getUserResumesServiceResponseBodyGenerator(userID, resumeList);
            return new ResponseEntity(responseBody, HttpStatus.OK);
        } catch (UserNotFoundException e) {
            return userExceptionHandler.userNotFoundHandler(e);
        } catch (Exception e) {
            return userExceptionHandler.serverErrorHandler(e);
        }
    }

    @PostMapping("/{userID}/upload-resume")
    public ResponseEntity uploadResume(@PathVariable String userID, @RequestBody MongoResume resume) {
        try {
            userService.uploadUserResumeService(userID, resume);
            Map responseBody = userService.uploadUserResumeServiceResponseBodyGenerator();
            return new ResponseEntity(responseBody, HttpStatus.OK);
        } catch (UserNotFoundException e) {
            return userExceptionHandler.userNotFoundHandler(e);
        } catch (Exception e) {
            return userExceptionHandler.serverErrorHandler(e);
        }
    }

    @DeleteMapping("/{userID}/resumes/delete-resume")
    public ResponseEntity deleteResume(@PathVariable String userID, @RequestBody String resumeName) {
        try {
            userService.deleteUserResumeService(userID, resumeName);
            Map responseBody = userService.deleteUserResumeServiceResponseBodyGenerator();
            return new ResponseEntity(responseBody, HttpStatus.OK);
        } catch (UserNotFoundException e) {
            return userExceptionHandler.userNotFoundHandler(e);
        } catch (Exception e) {
            return userExceptionHandler.serverErrorHandler(e);
        }
    }
}
