package com.example.resources;

import com.example.models.Message;
import io.quarkus.hibernate.reactive.panache.Panache;
import io.smallrye.mutiny.Uni;
import lombok.extern.slf4j.Slf4j;

import javax.enterprise.context.ApplicationScoped;
import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/")
//@Transactional
@ApplicationScoped
@Slf4j
public class MessageResource {

    @Path("/message")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
//    @JsonIgnoreProperties(ignoreUnknown = true)
    public Uni<Response> process(@Valid Message message) {
        System.out.println(message);
        // todo External requests (python services)
        // RestClientBuilder.newBuilder().baseUri("...")

        return Panache.withTransaction(message::persist)
                .replaceWith(Response.ok(message)
                        .status(Response.Status.CREATED)::build)
                .onFailure()
                .invoke(x -> log.error("Error when processing POST query " + x.getMessage()))
                .onFailure()
                .recoverWithItem(Response.status(Response.Status.BAD_REQUEST)
                        .entity("Sorry, this username is already in use.")::build);

    }

}