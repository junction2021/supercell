package com.example.models;

import io.quarkus.hibernate.orm.panache.PanacheEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

@Table(name = "history")
@Entity
public class History extends PanacheEntity {
    @Column(name = "username")
    @NotBlank(message = "Username in history can't be empty")
    public String username;

    @Column(name = "color")
    @NotBlank(message = "Color in history can't be empty")
    public String color;

    @Column(name = "text")
    @NotBlank(message = "Text in history can't be empty")
    public String text;
}