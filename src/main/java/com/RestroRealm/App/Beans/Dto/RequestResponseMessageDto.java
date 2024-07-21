package com.RestroRealm.App.Beans.Dto;

import java.util.Map;

public class RequestResponseMessageDto {

    private String shortMessage;
    private int messageCode;
    private String longMessage;
    private Map<String, String> jsonEntity;

    public String getShortMessage() {
        return shortMessage;
    }

    public void setShortMessage(String shortMessage) {
        this.shortMessage = shortMessage;
    }

    public int getMessageCode() {
        return messageCode;
    }

    public void setMessageCode(int messageCode) {
        this.messageCode = messageCode;
    }

    public String getLongMessage() {
        return longMessage;
    }

    public void setLongMessage(String longMessage) {
        this.longMessage = longMessage;
    }

    public Map<String, String> getJsonEntity() {
        return jsonEntity;
    }

    public void setJsonEntity(Map<String, String> jsonEntity) {
        this.jsonEntity = jsonEntity;
    }

    public RequestResponseMessageDto(String shortMessage, int messageCode, String longMessage, Map<String, String> jsonEntity) {
        this.shortMessage = shortMessage;
        this.messageCode = messageCode;
        this.longMessage = longMessage;
        this.jsonEntity = jsonEntity;
    }

    public RequestResponseMessageDto() {
    }
}
