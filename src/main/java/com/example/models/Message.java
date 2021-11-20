package com.example.models;

import io.quarkus.hibernate.reactive.panache.PanacheEntityBase;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "message")
@Getter
@Setter
@ToString
@Cacheable
public class Message extends PanacheEntityBase {
    @Column(nullable = false, updatable = false)
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Basic(fetch = FetchType.EAGER)
    @ColumnDefault(value = "0")
    @Column
    private double score;

    @NotBlank(message = "Username can't be empty")
    @Basic(fetch = FetchType.EAGER)
    @Column(unique = true, updatable = false, length = 100)
    private String username;

    @NotEmpty(message = "Text can't be empty")//    @Basic(fetch = FetchType.EAGER)
    @ElementCollection
    private List<String> text = new ArrayList<>();

    @Basic(fetch = FetchType.EAGER)
    @Column
    private String date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
            .format(new Date());

}
