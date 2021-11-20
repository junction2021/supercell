package com.example.models;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
public class SimpleMessage {
    private String newMessage;
    private double karma;

    public SimpleMessage(Message m) {
        this.newMessage = m.getNew_message();
        this.karma = Math.round(m.getScore() * 100);
    }
}
