package com.example.resources;

import com.example.models.Message;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/")
@Transactional
public class MessageResource {

    @Path("/message")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @JsonIgnoreProperties(ignoreUnknown = true)
    public Response process(@Valid Message message) {
        // todo External requests (python services)
        // RestClientBuilder.newBuilder().baseUri("...")

        if (Message.containsUsername(message.getUsername()))
            return Response.status(Response.Status.BAD_REQUEST).entity("Sorry, this username is already in use.").build();
        message.persistAndFlush();
        // messageRepository.listAll().subscribe().with(x -> x.forEach(System.out::println));
        return Response.ok(Message.find("username", message.getUsername()).firstResult()).build();

    }
}