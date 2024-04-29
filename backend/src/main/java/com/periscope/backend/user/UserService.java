package com.periscope.backend.user;

import com.periscope.backend.user.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.List;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.UUID;

@Service
public class UserService {

    private UserRepository userRepository;
    private UserRepository userRepository1;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean checkUserPresent(String userID) throws UserNotFoundException {
        if(userRepository.existsById(userID)) {
            return true;
        } else {
            throw new UserNotFoundException("User does not exist!");
        }
    }

    public User getUserService(String userID) throws UserNotFoundException {
        Optional<User> userOptional = userRepository.findById(userID);
        if(userOptional.isPresent()) {
            User user = userOptional.get();
            return user;
        } else {
            throw new UserNotFoundException("Oops! The user does not exist");
        }
    }

    public void createUserService(User userInfo) {
        // Generate ID
        String generatedUserID = UUID.randomUUID().toString().replace("-", "");
        if(userInfo.getResumes() != null) {
            System.out.println(userInfo.getResumes());
        }
        userInfo.setUserID(generatedUserID);
        userRepository.save(userInfo);
    }

    public Map<String, String> createUserServiceResponseBodyGenerator() {
        Map<String, String> responseBody = new HashMap<String, String>();
        responseBody.put("status", "SUCCESS");
        responseBody.put("message", "User created!");
        return responseBody;
    }

    public void deleteUserService(String userID) throws UserNotFoundException {
        if(checkUserPresent(userID)) {
            userRepository.deleteById(userID);
        }
    }

    public Map<String, String> deleteUserServiceResponseBodyGenerator() {
        Map<String, String> responseBody = new HashMap<String, String>();
        responseBody.put("status", "SUCCESS");
        responseBody.put("message", "User deleted!");
        return responseBody;
    }

    public void updateUserService(String userID, User user) throws UserNotFoundException {
        if(checkUserPresent(userID)) {
            User userInfo = userRepository.findById(userID).get();
            user.setEmail(userInfo.getEmail());
            userRepository.save(user);
        }
    }

    public Map updateUserServiceResponseBodyGenerator() {
        Map<String, String> responseBody = new HashMap<String, String>();
        responseBody.put("status", "SUCCESS");
        responseBody.put("message", "User updated successfully!");
        return responseBody;
    }

    public List<MongoResume> getUserResumesService(String userID) throws UserNotFoundException {
        Optional<User> userOptional = userRepository.findById(userID);
        if(userOptional.isPresent()) {
            List<MongoResume> resumeList = userOptional.get().getResumes();
            return resumeList;
        } else {
            throw new UserNotFoundException("Oops! User does not exist!");
        }
    }

    public HashMap<String, Object> getUserResumesServiceResponseBodyGenerator(String userID, List<MongoResume> userResumes) {
        HashMap<String, Object> responseBody = new HashMap<String, Object>();
        responseBody.put("user_id", userID);
        List<HashMap<String, Object>> responseBodyList = new ArrayList<HashMap<String, Object>>();
        if(userResumes != null) {
            userResumes.forEach((resume) -> {
                HashMap<String, Object> resumeObject = new HashMap<String, Object>();
                resumeObject.put("file_name", resume.getResumeName());
                resumeObject.put("file", resume.getFile());
                responseBodyList.add(resumeObject);
            });
        }
        responseBody.put("user_resumes", responseBodyList);
        return responseBody;
    }

    public void uploadUserResumeService(String userID, MongoResume resume) throws UserNotFoundException {
        if(checkUserPresent(userID)) {
            List<MongoResume> userResumes = getUserResumesService(userID);
            userResumes.add(resume);
            User user = getUserService(userID);
            user.setResumes(userResumes);
            updateUserService(userID, user);
        }
    }

    public Map<String, String> uploadUserResumeServiceResponseBodyGenerator() {
        Map<String, String> responseBody = new HashMap<String, String>();
        responseBody.put("status", "SUCCESS");
        responseBody.put("message", "Resume uploaded successfully!");
        return responseBody;
    }

    public void deleteUserResumeService(String userID, String resumeName) throws UserNotFoundException {
        if(checkUserPresent(userID)) {
            User user = getUserService(userID);
            List<MongoResume> userResumes = user.getResumes();
            userResumes.forEach( (userResume) -> {
                if(userResume.getResumeName().equals(resumeName)) {
                    userResumes.remove(userResume);
                }
            });
            user.setResumes(userResumes);
            updateUserService(userID, user);
        }
    }

    public Map<String, String> deleteUserResumeServiceResponseBodyGenerator() {
        Map<String, String> responseBody = new HashMap<String, String>();
        responseBody.put("status", "SUCCESS");
        responseBody.put("message", "Resume deleted successfully!");
        return responseBody;
    }
}
