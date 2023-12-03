package com.periscope.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private UserService userService;

    @Autowired
    public void UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/new-user")
    public boolean createUser(@RequestBody User userInfo) {
        return userService.createUserService(userInfo);
    }

    @DeleteMapping("/{userID}/delete")
    public boolean deleteUser(@PathVariable String userID) {
        return userService.deleteUserService(userID);
    }

    @GetMapping("/{userID}/resumes")
    public List<MongoResume> getUserResumes(@PathVariable String userID) {
        return userService.getUserResumesService(userID);
    }

//    @GetMapping("{userID}/resumes/{resume}/jobs")
//    public List

}
