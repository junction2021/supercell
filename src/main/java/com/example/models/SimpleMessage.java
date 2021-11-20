package com.example.models;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
public class SimpleMessage {
    private String newMessage;
    private int karma;

    public SimpleMessage(Message m) {
        this.newMessage = m.getNew_message();
        this.karma = (int) Math.round(m.getScore() * 100);
    }
}
