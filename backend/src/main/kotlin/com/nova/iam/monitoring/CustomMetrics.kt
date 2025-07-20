package com.nova.iam.monitoring

import io.micrometer.core.instrument.MeterRegistry
import io.micrometer.core.instrument.Timer
import io.micrometer.core.instrument.Counter
import org.springframework.stereotype.Component
import java.time.Duration

@Component
class CustomMetrics(private val meterRegistry: MeterRegistry) {

    private val apiRequestsTotal: Counter = Counter.builder("nova_iam_api_requests_total")
        .description("Total number of API requests")
        .register(meterRegistry)

    private val keycloakOperationsTotal: Counter = Counter.builder("nova_iam_keycloak_operations_total")
        .description("Total number of Keycloak operations")
        .register(meterRegistry)

    fun incrementApiRequests(endpoint: String, method: String, status: String) {
        apiRequestsTotal.increment()
    }

    fun incrementKeycloakOperations(operation: String, success: Boolean) {
        keycloakOperationsTotal.increment()
    }
}