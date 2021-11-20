package com.example.resources;

import com.example.models.Message;
import com.example.models.SimpleMessage;
import com.example.repositories.MessageRepository;
import io.quarkus.cache.CacheResult;
import io.quarkus.logging.Log;
import io.smallrye.mutiny.Uni;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Arrays;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Path("/")
@ApplicationScoped
public class MessageResource {

    @Inject
    MessageRepository messageRepository;

    @Path("message")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    @CacheResult(cacheName = "process")
//    @Blocking
    public Uni<Response> process(@Valid Message message) {
        Message parsedText = new Message();
        try {
            parsedText = ResteasyClientBuilder.newClient().target("https://9571-37-235-56-152.ngrok.io/proceed_text/?message=" + message.getText())
                    .request()
                    .accept(MediaType.APPLICATION_JSON)
                    .rx()
                    .get()
                    .toCompletableFuture()
                    .exceptionally(x -> {
                        Log.error("Something went wrong during the request: " + x.getMessage());
                        return Response.status(Response.Status.BAD_REQUEST).entity("External service is unavailable. Please try again later").build();
                    })
                    .get()
                    .readEntity(Message.class);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
        if (!parsedText.getNew_message().equals(message.getText())) {
            message.setNew_message(parsedText.getNew_message());
        } else {
            message.setNew_message("");
        }
        message.setLabel(parsedText.getLabel());
        message.setMessage_index(parsedText.getMessage_index());
        message.setScore(message.getMessage_index() + (1 / (1 + 0.5 * (System.currentTimeMillis() - message.getDate().getTime()))));
        if (messageRepository.find("username", message.getUsername()).count() > 0) {
            message.setText(messageRepository.find("username", message.getUsername()).firstResult().getText() + ", " + message.getText());
            messageRepository.find("username", message.getUsername()).firstResult().setNew_message(message.getNew_message());
            messageRepository.find("username", message.getUsername()).firstResult().setText(message.getText());
            messageRepository.find("username", message.getUsername()).firstResult().setLabel(message.getLabel());
            messageRepository.find("username", message.getUsername()).firstResult().setScore(message.getScore());
            messageRepository.find("username", message.getUsername()).firstResult().setDate(message.getDate());
            messageRepository.find("username", message.getUsername()).firstResult().setMessage_index(message.getMessage_index());
            messageRepository.find("username", message.getUsername()).firstResult().setJsonText(Arrays.stream(message.getText().split(",")).parallel().collect(Collectors.toList()));
            return Uni.createFrom().item(Response.ok(new SimpleMessage(message)).status(Response.Status.OK).build());
        }
        return Uni.createFrom().item(messageRepository)
                .onItem().invoke(x -> x.persist(message))
                .replaceWith(Response.ok(new SimpleMessage(message))
                        .status(Response.Status.CREATED)::build)
                .onFailure()
                .invoke(x -> Log.error("Error when processing POST query " + x.getMessage()))
                .onFailure()
                .recoverWithItem(Response.status(Response.Status.BAD_REQUEST)
                        .entity("Sorry, this username is already in use.")::build);
    }

    @GET
    @Path("get")
    @Produces(MediaType.APPLICATION_JSON)
    @CacheResult(cacheName = "getSingle")
//    @Blocking
    public Uni<Response> get(@QueryParam("id") long id) {
        return Uni.createFrom().item(() -> messageRepository.findById(id))
                .onItem().castTo(Message.class)
                .onItem()
                .transform(x -> Response.ok(x)
                        .status(Response.Status.FOUND)
                        .build())
                .onFailure()
                .invoke(x -> Log.error("Something went wrong with GET by ID: " + x.getMessage()))
                .onFailure()
                .recoverWithItem(Response
                        .status(Response.Status.BAD_REQUEST)
                        .entity("Sorry, try later or input correct ID")::build);
    }

    @GET
    @Path("get/all")
    @Produces(MediaType.APPLICATION_JSON)
    @CacheResult(cacheName = "getAll")
//    @Blocking
    public Uni<Response> getAll() {
        return Uni.createFrom().item(messageRepository.listAll())
                .onItem()
                .transform(x -> x.stream()
                        .parallel()
                        .peek(w -> w.setJsonText(Arrays.stream(w.getText().split(",")).parallel().collect(Collectors.toList())))
                        .collect(Collectors.toList()))
                .onItem()
                .transform(x -> Response.ok(x)
                        .status(Response.Status.FOUND)
                        .build())
                .onFailure()
                .invoke(x -> Log.error("Something went wrong with GET ALL: " + x.getMessage()))
                .onFailure()
                .recoverWithItem(Response
                        .status(Response.Status.METHOD_NOT_ALLOWED)
                        .entity("Try again later")::build);
    }

}