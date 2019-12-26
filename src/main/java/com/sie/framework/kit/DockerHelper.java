package com.sie.framework.kit;

import com.sie.framework.exception.SieException;

import java.util.List;

/**
 * <p>
 * Title:
 * </p>
 * <p>
 * Description:
 * </p>
 * <p>
 *
 * @author:陈鑫 </p>
 * <p>
 * @Date:2018/10/8 </p>
 * <p>
 * Department : 研发部
 * </p>
 * <p> Copyright : ©江苏汇鑫融智软件科技有限公司 </p>
 */
public class DockerHelper {

    private ShellHelper executor;

    public DockerHelper(ShellHelper executor) {
        this.executor = executor;
    }

    public List<String> getShellExecuteResult(String cmd) {
        List<String> result = null;
        try {
            result = executor.executeAndGetResult(cmd);
        } catch (Exception e) {
            throw new SieException("执行shell命令失败", e);
        } finally {
            return result;
        }
    }


}
