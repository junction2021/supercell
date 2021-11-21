package com.example.models;

import io.quarkus.hibernate.orm.panache.PanacheEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.transaction.Transactional;
import javax.validation.constraints.NotBlank;

@Table(name = "history")
@Entity
@Transactional
public class History extends PanacheEntity {
    @Column(name = "username", length = 1000)
    @NotBlank(message = "Username in history can't be empty")
    public String username;

    @Column(name = "color", length = 1000)
    @NotBlank(message = "Color in history can't be empty")
    public String color;

    @Column(name = "background_color", length = 1000)
    @NotBlank(message = "Background color in history can't be empty")
    public String background_color;

    @Column(name = "text", length = 1000)
    @NotBlank(message = "Text in history can't be empty")
    public String text;

    public String getText() {
        return text;
    }

    public String getUsername() {
        return username;
    }

    public String getBackground_color() {
        return background_color;
    }

    public String getColor() {
        return color;
    }
}