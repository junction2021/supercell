package com.example.models;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
@Getter
@Setter
public class Text extends PanacheEntity {
    @ManyToOne
    @JoinColumn(name = "message_id")
    private Message text_content;
}
