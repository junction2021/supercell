package com.example.resources;

import com.example.models.History;
import io.quarkus.cache.CacheResult;
import io.quarkus.panache.common.Sort;
import io.smallrye.mutiny.Uni;
import org.eclipse.microprofile.metrics.MetricUnits;
import org.eclipse.microprofile.metrics.annotation.Counted;
import org.eclipse.microprofile.metrics.annotation.Timed;

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
    @Counted(name = "historyPostChecks", description = "How many historyPost checks have been performed.")
    @Timed(name = "historyPostTimer", description = "A measure of how long it takes to perform the historyPost test.", unit = MetricUnits.MILLISECONDS)
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
    @Counted(name = "historyGetChecks", description = "How many historyGet checks have been performed.")
    @Timed(name = "historyGetTimer", description = "A measure of how long it takes to perform the historyGet test.", unit = MetricUnits.MILLISECONDS)
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
