package com.example.resources;

import com.example.models.Message;
import io.quarkus.hibernate.reactive.panache.Panache;
import io.quarkus.logging.Log;
import io.smallrye.mutiny.Uni;
import lombok.SneakyThrows;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;

import javax.enterprise.context.ApplicationScoped;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Path("/")
@ApplicationScoped
public class MessageResource {

    @SneakyThrows
    @Path("/message")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
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
        System.out.println(parsedText);
        message.setNew_message(parsedText.getNew_message());
        message.setLabel(parsedText.getLabel());
        message.setMessage_index(parsedText.getMessage_index());

//        ParsedText.listAll().subscribe().with(System.out::println);
//        ParsedText.listAll().onItem().transform(x -> x.stream().parallel()
//                        .map(y -> (ParsedText) y)
//                        .filter(l -> l.getMessage() != null)
//                        .peek(o -> o.message.setScore(o.message.getScore() + (double) (1 / (1 + 10 * (System.currentTimeMillis() - o.message.getDate().getTime())))))
//                                .collect(Collectors.toList()));
//
//        ParsedText.listAll().subscribe().with(System.out::println);
//        Panache.withTransaction(message::persist);
//        Panache.withTransaction(parsedText::persist);
        return Panache.withTransaction(message::persist)
                .replaceWith(Response.ok(message)
                        .status(Response.Status.CREATED)::build)
                .onFailure()
                .invoke(x -> Log.error("Error when processing POST query " + x.getMessage()))
                .onFailure()
                .recoverWithItem(Response.status(Response.Status.BAD_REQUEST)
                        .entity("Sorry, this username is already in use.")::build);
    }

    @GET
    @Path("/get")
    @Produces(MediaType.APPLICATION_JSON)
    public Uni<Response> get(@QueryParam("id") long id) {
        return Panache.withTransaction(() -> Message.findById(id))
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
    @Path("/get/all")
    @Produces(MediaType.APPLICATION_JSON)
    public Uni<Response> getAll() {
        return Message.listAll()
                .onItem()
                .transform(x -> x.stream()
                        .parallel()
                        .map(el -> (Message) el)
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