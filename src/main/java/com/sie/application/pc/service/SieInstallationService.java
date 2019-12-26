package com.sie.application.pc.service;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.sie.application.pc.entity.SieInstallation;
import com.sie.application.pc.mapper.SieInstallationMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.*;

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
 * @Date:2018/11/5 </p>
 * <p>
 * Department : 研发部
 * </p>
 * <p> Copyright : ©江苏汇鑫融智软件科技有限公司 </p>
 */
@Service
public class SieInstallationService extends ServiceImpl<SieInstallationMapper, SieInstallation> {

    @Autowired
    SieInstallationMapper sieInstallationMapper;

    private BlockingQueue queue = new LinkedBlockingDeque<>(10000);

    private ExecutorService executor = new ThreadPoolExecutor(10, 20, 10 * 60 * 1000, TimeUnit.MILLISECONDS, queue);


    public List<SieInstallation> listSieInstallationByProjectId(String projectId) {
        return sieInstallationMapper.selectList(new EntityWrapper<SieInstallation>().eq("PROJECT_ID", projectId));
    }

    public String getVersionFromSieInstallationByNodeId(String nodeId, List<SieInstallation> sieInstallationList) {
            for (SieInstallation sieInstallation :
                    sieInstallationList) {
                String content = sieInstallation.getContent();
                JSONObject contentObject = JSONObject.parseObject(content);
                JSONObject configObject = (JSONObject) contentObject.get("config");
                JSONObject sieObject = (JSONObject) configObject.get("sie");
                JSONObject nodeObject = (JSONObject) sieObject.get("node");
                String id = (String) nodeObject.get("id");
                Object selectedTag = contentObject.get("selectedTag");
                if (nodeId.equals(id)&& selectedTag !=null) {
                    JSONObject selectedTagObject = (JSONObject) selectedTag;
                    return (String) selectedTagObject.get("name");
                }
            }
        return null;
    }

}
