package com.sie.framework.controller;

import com.joinforwin.toolkit.result.Result;
import com.joinforwin.toolkit.result.ResultBuilder;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by sunzhiyang on 2017/3/14.
 */
@ControllerAdvice
public class ExceptionController {

    @ResponseBody
    @ExceptionHandler(Exception.class)
    public Result runtimeExceptionHandler(Exception e) {
        return ResultBuilder.error("未捕获的异常", e).build();
    }
}