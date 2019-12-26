package com.sie.framework.kit;

import com.jcraft.jsch.*;
import com.sie.message.kit.QuietClose;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class ShellHelper {
    //远程主机的ip地址
    private String ip;
    //远程主机登录用户名
    private String username;
    //远程主机的登录密码
    private String password;
    //设置ssh连接的远程端口
    private static final int DEFAULT_SSH_PORT = 22;
    //输出内容
    private List<String> results;
    //异常内容
    private String err = "";

    public ShellHelper(String ip, String username, String password) {
        this.ip = ip;
        this.username = username;
        this.password = password;
        results = new ArrayList<>();
    }

    public List<String> executeAndGetResult(String command) throws Exception {
        results = new ArrayList<>();
        Session session = getSession();
        ChannelExec channelExec = null;
        BufferedReader input = null;
        OutputStream out = null;
        try {
            //打开通道，设置通道类型，和执行的命令
            Channel channel = session.openChannel("exec");
            channelExec = (ChannelExec) channel;
            channelExec.setCommand(command);
            channelExec.setInputStream(null);
            out = new ByteArrayOutputStream();
            channelExec.setErrStream(out);
            input = new BufferedReader(new InputStreamReader
                    (channelExec.getInputStream()));
            channelExec.connect();
            //接收远程服务器执行命令的结果
            String line;
            while ((line = input.readLine()) != null) {
                results.add(line);
            }
        } finally {
            if (channelExec != null) {
                channelExec.disconnect();
            }
            if (session != null) {
                session.disconnect();
            }
            QuietClose.close(input);
            QuietClose.close(out);
        }
        return results;
    }

    private Session getSession() throws JSchException {
        JSch jsch = new JSch();
        Session session = jsch.getSession(username, ip, DEFAULT_SSH_PORT);
        session.setPassword(password);
        Properties config = new Properties();
        config.put("StrictHostKeyChecking", "no");
        session.setConfig(config);
        session.setTimeout(600000);
        try {
            session.connect();
        } catch (JSchException e) {
            throw new JSchException("服务器" + ip + "连接失败, 用户名或密码错误", e);
        }
        return session;
    }

    /**
     * 获取执行shell命令的返回值
     *
     * @return
     */
    public List<String> getResults() {
        return results;
    }

    public String getErr() {
        return err;
    }
}
