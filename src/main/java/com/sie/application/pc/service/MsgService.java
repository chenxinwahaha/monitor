package com.sie.application.pc.service;

import com.alibaba.fastjson.JSON;
import com.joinforwin.toolkit.kit.IdKit;
import com.sie.framework.exception.SieException;
import com.sie.framework.kit.EventType;
import com.sie.message.MessageService;
import com.sie.message.entity.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;

/**
 * <p>
 * Title :
 * </p>
 * <p>
 * Description:
 * </p>
 * <p>
 * Author : 陈鑫 2018/5/20
 * </p>
 * <p>
 * Department : 研发部
 * </p>
 * <p> Copyright : ©江苏汇鑫融智软件科技有限公司 </p>
 */
@Service
public class MsgService {

    @Autowired
    MessageService messageService;


    @Autowired
    NodeService nodeService;

    @Value("${sie-message.config.type}")
    private String type;

    @Value("${sie-message.config.touser}")
    private String toUser;

    @Value("${sie-message.config.wechat.agentid}")
    private String wechatAgentId;

    @Value("${sie-message.config.dingtalk.agentid}")
    private String dingtalkAgentId;

    private static Logger logger = LoggerFactory.getLogger(MsgService.class);

    private BlockingQueue queue = new LinkedBlockingDeque<>(10000);

    private ExecutorService executor = new ThreadPoolExecutor(10, 20, 10 * 60 * 1000, TimeUnit.MILLISECONDS, queue);

    public void onMessage(Map messageAsMap) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    addMessage(messageAsMap);
                } catch (Exception e) {
                    logger.error("onMessage", e);
                }
            }
        });
    }

    public void addMessage(Map messageAsMap) {
        String code = (String) messageAsMap.get("code");
        Boolean flag = true;
        Boolean pushCode = true;
        switch (code) {
            case EventType.FLOW_LOAD_ERROR:
                messageAsMap.put("codeName", "集成流加载失败");
                break;
            case EventType.INITIALIZE_ELASTICSEARCH_INDEX_ERROR:
                messageAsMap.put("codeName", "初始化ElasticSearch索引失败");
                break;
            case EventType.JOB_SCHEDULE_ERROR:
                messageAsMap.put("codeName", "定时作业调度失败");
                break;
            case EventType.JOB_SCHEDULE_TIMEOUT_ERROR:
                messageAsMap.put("codeName", "定时作业执行时长超出平均时间");
                break;
            case EventType.REPUBLISH_ERROR:
                messageAsMap.put("codeName", "重新发布失败");
                break;
            case EventType.REPUSH_ERROR:
                messageAsMap.put("codeName", "重新推送失败");
                break;
            case EventType.ERROR_PUBLISH:
                messageAsMap.put("codeName", "发布失败");
                break;
            case EventType.ERROR_PUSH:
                messageAsMap.put("codeName", "推送失败");
                break;
            case EventType.ERROR_REQUEST:
                messageAsMap.put("codeName", "请求失败");
                break;
            case EventType.FLOATINGIP_CONNECT_ERROR:
                messageAsMap.put("codeName", "浮动IP Ping失败");
                break;
            case EventType.FLOATINGIP_DELAY_ERROR:
                messageAsMap.put("codeName", "浮动IP响应时间过长");
                break;
            case EventType.FLOATINGIP_RECONNECT_SUCCESS:
                messageAsMap.put("codeName", "浮动IP重Ping成功");
                break;
            case EventType.NGINX_BALANCE_ERROR:
                messageAsMap.put("codeName", "负载均衡器无响应");
                break;
            case EventType.NODE_STATUS_ERROR:
                messageAsMap.put("codeName", "节点无响应");
                break;
            case EventType.NODE_CONNECT_ERROR:
                messageAsMap.put("codeName", "节点连接失败");
                break;
            case EventType.IDE_USAGE_ERROR:
                messageAsMap.put("codeName", "IDE内存、磁盘占用过高");
                break;
            case EventType.LINUX_USAGE_ERROR:
                messageAsMap.put("codeName", "Linux系统资源占用过高");
                break;
            case EventType.DOCKER_CONNECT_ERROR:
                messageAsMap.put("codeName", "Docker连接失败");
                break;
            case EventType.CONTAINER_MEMORY_WARNING:
                messageAsMap.put("codeName", "容器内容使用超过1G");
                break;
            case EventType.DOCKER_CMD_ERROR:
                messageAsMap.put("codeName", "Docker命令执行失败");
                break;
            case EventType.LINUX_CMD_ERROR:
                messageAsMap.put("codeName", "Linux命令执行失败");
                break;
            case EventType.LINUX_CONNECT_ERROR:
                messageAsMap.put("codeName", "Linux连接失败");
                break;
            case EventType.NGINX_NODE_ERROR:
                messageAsMap.put("codeName", "负载均衡器无可用节点");
                break;
            case EventType.IDE_CONNECT_ERROR:
                messageAsMap.put("codeName", "IDE连接失败");
                break;
            case EventType.ELASTICSEARCH_CONNECT_ERROR:
                messageAsMap.put("codeName", "ElasticSearch连接失败");
                pushCode = false;
                break;
            case EventType.ELASTICSEARCH_CONNECT_SUCCESS:
                messageAsMap.put("codeName", "ElasticSearch连接成功");
                pushCode = false;
                break;
            case EventType.CONTAINER_RUNNING:
                messageAsMap.put("codeName", "正在运行的节点");
                break;
            default:
                flag = false;
                break;
        }
        if (flag) {
            //添加id
            messageAsMap.put("id", IdKit.createId());
            //推送消息
            sendNewsMsg(messageAsMap);
        }
    }

    public void sendNewsMsg(Map messageAsMap) {
        NewsMessage newsMessage = new NewsMessage();
        Article article = new Article();
        newsMessage.getNews().setArticle(article);
        newsMessage.setMsgType("");
        article.setTitle((String) messageAsMap.get("codeName"));
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append(messageAsMap.get("tips")).append("\n").append("发生时间：").append(messageAsMap.get("time")).append("\n");
        article.setDescription(stringBuilder.toString());
        sendWechatOrDingtalkMsg(newsMessage);
    }

    public void sendWechatOrDingtalkMsg(Message message) {
        message.setPlatform(type);
        switch (type) {
            case "Wechat":
                //微信
                message.setAgentId(wechatAgentId);
                break;
            case "Dingtalk":
                //钉钉
                message.setAgentId(dingtalkAgentId);
                break;
            default:
                message.setAgentId(wechatAgentId);
        }
        message.setToUser(toUser);
        try {
            MessageResult messageResult = messageService.sendMessage(message);
            if (!MessageResult.CodeType.Success.name().equals(messageResult.getCode())) {
                throw new SieException(type + "消息推送失败:" + messageResult.getMessage());
            }
        } catch (Exception e) {
            logger.error(type + "消息推送失败", e);
        }
    }
}
