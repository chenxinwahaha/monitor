package com.sie.framework.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;


/**
 * <p>
 * Title :
 * </p>
 * <p>
 * Description:
 * </p>
 * <p>
 * Author :tyz 2017/6/5
 * </p>
 * <p>
 * Department : 研发部
 * </p>
 * Copyright : ©2014-2014 江苏汇鑫融智软件科技有限公司
 * </p>
 */
@Controller
@ConfigurationProperties(prefix = "jfw")
public class IndexController {

    private static Logger logger = LoggerFactory.getLogger(IndexController.class);

    final static long time = System.currentTimeMillis();

    @Value("${jfw.is-dev}")
    private boolean isDev;

    @Value("${jfw.dev-server-port}")
    private int port;

    @RequestMapping("/")
    public String index(HttpSession session, Model model) {
        model.addAttribute("time", time);
        model.addAttribute("jsPath", getIndexPath(isDev, port));
        return "index";
    }

    @RequestMapping("/mobile")
    public String mobileIndex(HttpSession session, Model model) {
        model.addAttribute("time", time);
        model.addAttribute("jsPath", getMobileIndexPath(isDev, port));
        return "iframe";
    }

    @RequestMapping("/detail/{id}")
    public String detailIndex(@PathVariable("id") String id, HttpSession session, Model model) {
        try {
            String decode = URLDecoder.decode(id, "UTF-8");
            model.addAttribute("id", decode);
        } catch (UnsupportedEncodingException e) {
            logger.info("id解码失败:id=" + id, e);
        }
        model.addAttribute("time", time);
        model.addAttribute("jsPath", getDetailIndexPath(isDev, port));
        return "detail";
    }

    @RequestMapping("/yesterday/{id}")
    public String yesterdayDetailIndex(@PathVariable("id") String id, HttpSession session, Model model) {
        try {
            String decode = URLDecoder.decode(id, "UTF-8");
            model.addAttribute("id", decode);
        } catch (UnsupportedEncodingException e) {
            logger.info("id解码失败:id=" + id, e);
        }
        model.addAttribute("time", time);
        model.addAttribute("jsPath", getYesterdayDetailIndexPath(isDev, port));
        return "yesterday";
    }

    @RequestMapping("/login")
    public String login(HttpSession session, Model model) {
        return "login";
    }

    private String getIndexPath(boolean isDev, int port) {
        if (isDev) {
            return "http://localhost:" + port + "/pc.js";
        } else {
            return "../dist/pc.js?k=" + time;
        }
    }

    private String getMobileIndexPath(boolean isDev, int port) {
        if (isDev) {
            return "http://localhost:" + port + "/mobile.js";
        } else {
            return "../dist/mobile.js?k=" + time;
        }
    }

    private String getDetailIndexPath(boolean isDev, int port) {
        if (isDev) {
            return "http://localhost:" + port + "/detail.js";
        } else {
            return "../dist/detail.js?k=" + time;
        }
    }

    private String getYesterdayDetailIndexPath(boolean isDev, int port) {
        if (isDev) {
            return "http://localhost:" + port + "/yesterday.js";
        } else {
            return "../dist/yesterday.js?k=" + time;
        }
    }

    private String getInitPath() {
        return "framework/init/init.js?k=" + time;
    }
}
