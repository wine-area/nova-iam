package com.nova.iam

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class NovaIamApplication

fun main(args: Array<String>) {
    runApplication<NovaIamApplication>(*args)
}