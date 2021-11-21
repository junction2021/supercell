package com.example.models;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import javax.transaction.Transactional;
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
@Transactional
public class Message {
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
    @Column(name = "username", updatable = false, length = 1000)
    private String username;

    @NotEmpty(message = "Text can't be empty")
    @Column(name = "text", length = 1000)
    private String text;

    @Basic(fetch = FetchType.EAGER)
    @Column(name = "date")
    private Date date = new Date();

    @Column(name = "new_message", length = 1000)
    private String new_message;

    @Column(name = "label", length = 1000)
    private String label;

    @Column(name = "message_index")
    private double message_index;

    @Transient
    private List<String> jsonText;

}
