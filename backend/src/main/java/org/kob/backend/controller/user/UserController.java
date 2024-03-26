package org.kob.backend.controller.user;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.kob.backend.mapper.UserMapper;
import org.kob.backend.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import javax.management.Query;
import java.util.List;

@RestController
public class UserController {
    @Autowired
    UserMapper userMapper;

    @GetMapping("/user/all/")
    public List<User> getAll() {
        return userMapper.selectList(null);
    }

    @GetMapping("/user/{userId}/")
    public User getUser(@PathVariable int userId) {
        // return userMapper.selectById(userId);


        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("id", userId);
        return userMapper.selectOne(queryWrapper);
    }
    @GetMapping("/user/add/{userId}/{username}/{password}")
    public String addUser(
            @PathVariable Integer userId,
            @PathVariable String username,
            @PathVariable String password){
        if(password.length()<6){
            return "请设置至少6位密码";
        }
        PasswordEncoder passwordEncoder=new BCryptPasswordEncoder();
        String encodingPassword=passwordEncoder.encode(password);
        User user=new User  (userId,username,encodingPassword);
        userMapper.insert(user);
        return "Add User Successfully";
      }
    @GetMapping("/user/delete/{userId}")
    public String deleteUser(@PathVariable int userId){
        userMapper.deleteById(userId);
        return "Delete User Successfully";
    }
}
