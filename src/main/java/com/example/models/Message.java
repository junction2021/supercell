package com.example.models;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

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
    @NotBlank(message = "Username can't be empty")
    @Basic(fetch = FetchType.LAZY)
    @Column(unique = true, updatable = false, length = 100)
    private String username;
    @NotBlank(message = "Text can't be empty")
    @Basic(fetch = FetchType.LAZY)
    @Column(length = 100)
    private String text;
//    @OneToMany(mappedBy = "text_content")
//    private List<Text> text = new ArrayList<>();
    @Basic(fetch = FetchType.LAZY)
    @ColumnDefault(value = "0")
    @Column
    private double score;

    public static boolean containsUsername(String username) {
        return Message.find("username", username).count() > 0;
    }

    /*
    @ElementCollection
    private ConcurrentHashMap<String, Double> scores;
     */
}
