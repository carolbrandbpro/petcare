package com.petcare.api

import retrofit2.http.Body
import retrofit2.http.POST

data class PetCreateRequest(
    val name: String,
    val species: String?,
    val breed: String?,
    val birth_date: String?
)

data class PetDto(
    val id: String,
    val name: String,
    val species: String?,
    val breed: String?
)

interface PetService {
    @POST("/api/pets")
    suspend fun create(@Body body: PetCreateRequest): PetDto
}