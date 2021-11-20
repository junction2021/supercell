package com.example.repositories;

import com.example.models.Message;
import io.quarkus.hibernate.reactive.panache.PanacheRepository;
import lombok.SneakyThrows;

import javax.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class MessageRepository implements PanacheRepository<Message> {
    @SneakyThrows
    public boolean containsUsername(String username) {
        return find("username", username).count().subscribeAsCompletionStage().get() > 0;
    }
}

