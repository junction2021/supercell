package com.example.resources;

import com.example.models.History;
import io.quarkus.cache.CacheResult;
import io.quarkus.panache.common.Sort;
import io.smallrye.mutiny.Uni;

import javax.enterprise.context.ApplicationScoped;
import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.stream.Collectors;

@Path("/")
@ApplicationScoped
public class HistoryResource {
    @POST
    @Path("history")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    @CacheResult(cacheName = "historyPost")
    public Uni<Response> history(@Valid History history) {
        history.persist();
        return Uni.createFrom()
                .item(Response
                        .ok(history)
                        .build());
    }

    @GET
    @Path("history")
    @Produces(MediaType.APPLICATION_JSON)
    @CacheResult(cacheName = "historyGet")
    public Uni<Response> historyGet() {
        return Uni.createFrom()
                .item(Response
                        .ok(History
                                .listAll(Sort
                                        .descending("id"))
                                .stream()
                                .parallel()
                                .limit(20)
                                .collect(Collectors.toList()))
                        .build());
    }
}
