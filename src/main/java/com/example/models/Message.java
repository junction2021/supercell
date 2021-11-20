package com.example.models;

import com.example.services.StringListConverter;
import io.quarkus.hibernate.reactive.panache.PanacheEntityBase;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "message")
@Getter
@Setter
@ToString
@Cacheable
public class Message extends PanacheEntityBase {
    @Column(name = "message_id", nullable = false, updatable = false)
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Basic(fetch = FetchType.EAGER)
    @ColumnDefault(value = "1.0")
    @Column(name = "score")
    private double score;

    @NotBlank(message = "Username can't be empty")
    @Basic(fetch = FetchType.EAGER)
    @Column(name = "username", unique = false, updatable = false, length = 100)
    private String username;

    @NotEmpty(message = "Text can't be empty")
    @Convert(converter = StringListConverter.class)
    public List<String> text;

    @Basic(fetch = FetchType.EAGER)
    @Column(name = "date")
    private Date date = new Date();

    @Column(name = "new_message")
    private String new_message;

    @Column(name = "label")
    private String label;

    @Column(name = "message_index")
    private String message_index;

}
