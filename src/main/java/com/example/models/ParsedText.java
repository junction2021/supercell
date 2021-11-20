package com.example.models;

import io.quarkus.hibernate.reactive.panache.PanacheEntityBase;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Getter
@Setter
@ToString
@Table(name = "parsedtext")
public class ParsedText extends PanacheEntityBase {
    @Id
    @GeneratedValue
    @Column(name = "parsedtext_id")
    private long id;

    @Column(name = "new_message")
    private String new_message;

    @Column(name = "label")
    private String label;

    @Column(name = "message_index")
    private String message_index;

//    @Column(name = "scores")
//    private String scoreString;
//
//    public void mapToString() {
//        this.scoreString = this.scores.toString();
//    }
}
