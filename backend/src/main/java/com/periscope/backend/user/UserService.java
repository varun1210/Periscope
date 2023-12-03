package com.periscope.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

@Service
public class UserService {

    private UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<MongoResume> getUserResumesService(String userID) {
        Optional<User> userOptional = userRepository.findById(userID);
//        List<MongoResume> resumes = userOptional.isPresent(user -> user.getResumes());
        if(userOptional.isPresent()) {
            User user = userOptional.get();
            return user.getResumes();
        } else {
            return null;
        }
    }

    public boolean createUserService(User userInfo) {
        userRepository.insert(userInfo);
        return true;
    }

    public boolean deleteUserService(String userID) {
        userRepository.deleteById(userID);
        return true;
    }

}
