package org.kob.backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.kob.backend.pojo.User;
@Mapper
public interface UserMapper extends BaseMapper<User> {

}
